'use server'

import { db } from '@/db'
import { 
  BedTable, 
  StaffTable, 
  ShiftTable, 
  PatientTable, 
  AppointmentTable, 
  UserTable,
  VitalsTable,
  ClinicalNotesTable,
  PrescriptionTable,
  MedicationAdminTable,
  BillingTable,
  PharmacyInventoryTable,
  LabOrderTable,
  LabResultTable,
  EquipmentTable,
  AssetAssignmentTable,
  WorkflowEventTable,
  AutomationLogTable
} from '@/db/schema'
import { eq, and, desc, like, or, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import icd10Data from '@/lib/icd10.json'
import { calculateNews2 } from '@/lib/clinical'

const ACCESS_SECRET = new TextEncoder().encode('vedaashram_access_secret')
const REFRESH_SECRET = new TextEncoder().encode('vedaashram_refresh_secret')

export type UserRole = 'DOCTOR' | 'NURSE' | 'ADMIN' | 'PATIENT'

// --- AUTH ACTIONS ---

export async function signIn(email: string, password: string) {
  const user = await db.select().from(UserTable).where(eq(UserTable.email, email)).all()
  if (!user[0] || !(await bcrypt.compare(password, user[0].password))) throw new Error('Invalid credentials')

  const userData = user[0]
  const accessToken = await new SignJWT({ id: userData.id, email: userData.email, role: userData.role }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('15m').sign(ACCESS_SECRET)
  const refreshToken = await new SignJWT({ id: userData.id }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(REFRESH_SECRET)

  const cookieStore = await cookies()
  cookieStore.set('refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return { accessToken, user: { id: userData.id, email: userData.email, role: userData.role as UserRole } }
}

export async function refreshAccessToken(): Promise<{ accessToken: string, user: { id: string, email: string, role: UserRole } } | null> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value
  if (!refreshToken) return null
  try {
    const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET)
    const user = await db.select().from(UserTable).where(eq(UserTable.id, payload.id as string)).all()
    if (!user[0]) return null
    const accessToken = await new SignJWT({ id: user[0].id, email: user[0].email, role: user[0].role }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('15m').sign(ACCESS_SECRET)
    return { accessToken, user: { id: user[0].id, email: user[0].email, role: user[0].role as UserRole } }
  } catch (e) { return null }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('refresh_token')
  revalidatePath('/')
}

export async function getCurrentUser() {
  try { 
    const result = await refreshAccessToken()
    return result ? result.user : null 
  } catch (e) { return null }
}

// --- CLINICAL ACTIONS ---

export async function generateMRN() {
  const year = new Date().getFullYear()
  const patients = await db.select().from(PatientTable).all()
  return `VA-${year}-${(patients.length + 1).toString().padStart(4, '0')}`
}

export async function getPatientById(id: string) {
  const patient = await db.select().from(PatientTable).where(eq(PatientTable.id, id)).all()
  return patient[0] || null
}

export async function getVitalsForPatient(patientId: string) {
  return await db.select().from(VitalsTable).where(eq(VitalsTable.patientId, patientId)).orderBy(desc(VitalsTable.recordedAt)).all()
}

export async function recordVitals(data: { patientId: string, staffId: string, heartRate?: number, bpSystolic?: number, bpDiastolic?: number, temp?: number, spO2?: number, respiratoryRate?: number, nuringNote?: string, consciousness?: 'ALERT' | 'ACVPU', supplementalOxygen?: boolean }) {
  const id = crypto.randomUUID()
  const recordedAt = new Date().toISOString()
  await db.insert(VitalsTable).values({ id, ...data, recordedAt })
  
  const news2 = calculateNews2({
    respirationRate: data.respiratoryRate || 18,
    spO2: data.spO2 || 98,
    supplementalOxygen: data.supplementalOxygen || false,
    systolicBP: data.bpSystolic || 120,
    pulse: data.heartRate || 70,
    temperature: data.temp || 36.5,
    consciousness: data.consciousness || 'ALERT'
  })

  if (news2.score >= 5) {
     const status: 'CRITICAL' | 'OBSERVATION' = news2.score >= 7 ? 'CRITICAL' : 'OBSERVATION'
     await db.update(PatientTable).set({ status }).where(eq(PatientTable.id, data.patientId))
     
     // TRIGGER AUTOMATION
     await triggerEvent('CRITICAL_VITALS', news2.score >= 7 ? 'CRITICAL' : 'WARNING', JSON.stringify({ 
        patientId: data.patientId, 
        score: news2.score,
        alertType: 'NEWS2_ESCALATION'
     }))
  }

  revalidatePath(`/patient/${data.patientId}`)
  return { news2 }
}

export async function dischargePatient(patientId: string) {
  const patient = await db.select().from(PatientTable).where(eq(PatientTable.id, patientId)).all()
  if (!patient[0]) return 
  
  const bedId = patient[0].bedId
  db.transaction(async (tx) => {
    await tx.update(PatientTable).set({ status: 'STABLE', bedId: null }).where(eq(PatientTable.id, patientId)).run()
    if (bedId) {
       await tx.update(BedTable).set({ status: 'AVAILABLE' }).where(eq(BedTable.id, bedId)).run()
    }
  })
  
  if (bedId) {
     await triggerEvent('BED_RELEASED', 'INFO', JSON.stringify({ bedId, patientId }))
  }
  revalidatePath('/')
}

export async function getClinicalNotesForPatient(patientId: string) {
  return await db.select().from(ClinicalNotesTable).where(eq(ClinicalNotesTable.patientId, patientId)).orderBy(desc(ClinicalNotesTable.createdAt)).all()
}

export interface ClinicalNoteInput {
  patientId: string
  staffId: string
  type: 'SOAP' | 'PROGRESS' | 'DISCHARGE' | 'REFERRAL'
  icdCode?: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

export async function addClinicalNote(data: ClinicalNoteInput) {
  const id = crypto.randomUUID()
  await db.insert(ClinicalNotesTable).values({ id, ...data, createdAt: new Date().toISOString() })
  revalidatePath(`/patient/${data.patientId}`)
  revalidatePath('/patient/phr')
}

export async function searchIcdCodes(query: string) {
  const q = query.toLowerCase()
  return icd10Data.filter(item => item.code.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)).slice(0, 10)
}

// --- EMERGENCY ACTIONS ---

export async function registerEmergency(data: any) {
  const id = crypto.randomUUID()
  const mrn = await generateMRN()
  const arrivalTime = new Date().toISOString()
  
  // Auto-Bed Assignment from ER Ward
  const erBeds = await db.select().from(BedTable).where(and(eq(BedTable.ward, 'ER-WARD'), eq(BedTable.status, 'AVAILABLE'))).limit(1).all()
  const bedId = erBeds[0]?.id || null

  db.transaction(async (tx) => {
    await tx.insert(PatientTable).values({ 
      id, 
      mrn, 
      ...data, 
      arrivalTime, 
      isEmergency: true, 
      status: 'CRITICAL', 
      bedId 
    }).run()
    if (bedId) {
      await tx.update(BedTable).set({ status: 'OCCUPIED' }).where(eq(BedTable.id, bedId)).run()
    }
  })

  revalidatePath('/emergency')
  return { success: true, id }
}

export async function getEmergencyPatients() {
  return await db.select({ patient: PatientTable, bed: BedTable })
    .from(PatientTable)
    .leftJoin(BedTable, eq(PatientTable.bedId, BedTable.id))
    .where(eq(PatientTable.isEmergency, true))
    .orderBy(desc(PatientTable.arrivalTime))
    .all()
}

export async function updateTriage(patientId: string, triageLevel: number) {
  await db.update(PatientTable).set({ triageLevel }).where(eq(PatientTable.id, patientId))
  revalidatePath('/emergency')
}

// --- PHARMACY ACTIONS ---

export async function getPharmacyInventory() {
  return await db.select().from(PharmacyInventoryTable).all()
}

export async function updatePharmacyStock(drugId: string, quantityShift: number) {
  const drug = await db.select().from(PharmacyInventoryTable).where(eq(PharmacyInventoryTable.id, drugId)).all()
  if (!drug[0]) throw new Error('Drug not found')
  const newQty = Math.max(0, drug[0].quantity + quantityShift)
  
  await db.update(PharmacyInventoryTable).set({ quantity: newQty }).where(eq(PharmacyInventoryTable.id, drugId))
  
  // TRIGGER AUTOMATION: Low stock warning
  if (newQty <= drug[0].reorderLevel) {
     await triggerEvent('LOW_STOCK', 'WARNING', JSON.stringify({ drugId, drugName: drug[0].drugName, quantity: newQty }))
  }
  
  revalidatePath('/pharmacy')
}

export async function getPrescriptionsForPatient(patientId: string) {
  return await db.select().from(PrescriptionTable).where(and(eq(PrescriptionTable.patientId, patientId), eq(PrescriptionTable.isActive, true))).all()
}

// --- LAB ACTIONS ---

export async function placeLabOrder(data: any) {
  const id = crypto.randomUUID()
  await db.insert(LabOrderTable).values({ id, ...data, status: 'PENDING', createdAt: new Date().toISOString() })
  
  // Potential STAT monitor trigger
  if (data.notes?.toLowerCase().includes('stat')) {
     // Placeholder for future time-based automation escalation
  }
  
  revalidatePath(`/patient/${data.patientId}`)
}

export async function getLabOrdersForPatient(patientId: string) {
  return await db.select({ order: LabOrderTable, result: LabResultTable })
    .from(LabOrderTable)
    .leftJoin(LabResultTable, eq(LabOrderTable.id, LabResultTable.orderId))
    .where(eq(LabOrderTable.patientId, patientId))
    .orderBy(desc(LabOrderTable.createdAt))
    .all()
}

export async function recordLabResult(orderId: string, resultJson: string, staffId: string) {
  const id = crypto.randomUUID()
  await db.insert(LabResultTable).values({ id, orderId, resultJson, verifiedBy: staffId, updatedAt: new Date().toISOString() })
  await db.update(LabOrderTable).set({ status: 'COMPLETED' }).where(eq(LabOrderTable.id, orderId))
  revalidatePath('/laboratory')
}

// --- AUTOMATION ENGINE ---

export async function triggerEvent(type: 'LOW_STOCK' | 'BED_RELEASED' | 'STAT_LAB_DELAY' | 'CRITICAL_VITALS' | 'DISCHARGE_PENDING', severity: 'INFO' | 'WARNING' | 'CRITICAL', metadata: string) {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  await db.insert(WorkflowEventTable).values({ id, type, severity, metadata, createdAt, status: 'PENDING' })
  
  // IMMEDIATE SIDE EFFECT PROCESSING (Simulated Rules Engine)
  await processAutomations(id)
}

export async function processAutomations(eventId: string) {
  const event = await db.select().from(WorkflowEventTable).where(eq(WorkflowEventTable.id, eventId)).all()
  if (!event[0]) return

  const logId = crypto.randomUUID()
  const executedAt = new Date().toISOString()
  let actionTaken = 'NO_ACTION'

  switch(event[0].type) {
    case 'LOW_STOCK':
      actionTaken = 'GENERATED_PHARMACY_REORDER_REQUEST'
      break
    case 'BED_RELEASED':
      actionTaken = 'NOTIFIED_HOUSEKEEPING_UNIT'
      break
    case 'CRITICAL_VITALS':
      actionTaken = 'ESCALATED_TO_RAPID_RESPONSE_TEAM'
      break
    default:
      actionTaken = 'LOGGED_TO_AUDIT_TRAIL'
  }

  await db.insert(AutomationLogTable).values({ id: logId, eventId, actionTaken, executedAt })
  await db.update(WorkflowEventTable).set({ status: 'PROCESSED' }).where(eq(WorkflowEventTable.id, eventId))
}

export async function getWorkflowEvents() {
  return await db.select().from(WorkflowEventTable).orderBy(desc(WorkflowEventTable.createdAt)).limit(50).all()
}

export async function getAutomationLogs() {
  return await db.select({ log: AutomationLogTable, event: WorkflowEventTable })
    .from(AutomationLogTable)
    .innerJoin(WorkflowEventTable, eq(AutomationLogTable.eventId, WorkflowEventTable.id))
    .orderBy(desc(AutomationLogTable.executedAt))
    .all()
}

// --- ASSET ACTIONS ---

export async function getEquipment() {
  return await db.select().from(EquipmentTable).all()
}

export async function getActiveAssignments() {
  return await db.select({ assignment: AssetAssignmentTable, equipment: EquipmentTable, patient: PatientTable })
    .from(AssetAssignmentTable)
    .innerJoin(EquipmentTable, eq(AssetAssignmentTable.equipmentId, EquipmentTable.id))
    .leftJoin(PatientTable, eq(AssetAssignmentTable.patientId, PatientTable.id))
    .where(eq(AssetAssignmentTable.status, 'ACTIVE'))
    .all()
}

export async function assignEquipment(equipmentId: string, patientId: string, staffId: string) {
  const id = crypto.randomUUID()
  const startTime = new Date().toISOString()
  
  db.transaction(async (tx) => {
    await tx.insert(AssetAssignmentTable).values({ id, equipmentId, patientId, assignedBy: staffId, startTime, status: 'ACTIVE' }).run()
    await tx.update(EquipmentTable).set({ status: 'IN_USE' }).where(eq(EquipmentTable.id, equipmentId)).run()
  })

  revalidatePath('/inventory/equipment')
}

export async function releaseEquipment(assignmentId: string) {
  const assignment = await db.select().from(AssetAssignmentTable).where(eq(AssetAssignmentTable.id, assignmentId)).all()
  if (!assignment[0]) throw new Error('Assignment not found')
  
  const endTime = new Date().toISOString()
  db.transaction(async (tx) => {
    await tx.update(AssetAssignmentTable).set({ endTime, status: 'RELEASED' }).where(eq(AssetAssignmentTable.id, assignmentId)).run()
    await tx.update(EquipmentTable).set({ status: 'AVAILABLE' }).where(eq(EquipmentTable.id, assignment[0].equipmentId)).run()
  })
  
  revalidatePath('/inventory/equipment')
}

// --- BILLING ACTIONS ---

export async function getBillingByPatientId(patientId: string) {
  return await db.select().from(BillingTable).where(eq(BillingTable.patientId, patientId)).all()
}

export async function addBillingEntry(data: any) {
  const id = crypto.randomUUID()
  await db.insert(BillingTable).values({ id, ...data, status: 'PENDING', date: new Date().toISOString().split('T')[0] })
  revalidatePath('/billing')
}

// --- OPS ACTIONS ---

export async function getBedsWithPatients() {
  return await db.select({ bed: BedTable, patient: PatientTable }).from(BedTable).leftJoin(PatientTable, eq(BedTable.id, PatientTable.bedId)).all()
}

export async function updateBedStatus(bedId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE') {
  await db.update(BedTable).set({ status }).where(eq(BedTable.id, bedId))
  revalidatePath('/')
}

export async function getAvailableERBeds() {
  return await db.select().from(BedTable).where(and(eq(BedTable.ward, 'ER-WARD'), eq(BedTable.status, 'AVAILABLE'))).all()
}

export async function getStaff() { return await db.select().from(StaffTable).all() }

export async function addStaff(data: any) {
  const id = crypto.randomUUID()
  await db.insert(StaffTable).values({ id, ...data, isActive: true })
  revalidatePath('/staff')
}

export async function checkIn(staffId: string) {
  const id = crypto.randomUUID(); await db.insert(ShiftTable).values({ id, staffId, checkIn: new Date().toISOString(), status: 'ACTIVE' }); revalidatePath('/')
}

export async function checkOut(shiftId: string) {
  await db.update(ShiftTable).set({ checkOut: new Date().toISOString(), status: 'COMPLETED' }).where(eq(ShiftTable.id, shiftId)); revalidatePath('/')
}

export async function getActiveShiftForStaff(staffId: string) {
  const data = await db.select().from(ShiftTable).where(and(eq(ShiftTable.staffId, staffId), eq(ShiftTable.status, 'ACTIVE'))).all()
  return data[0] || null
}

export async function getAppointments() {
  return await db.select({ appointment: AppointmentTable, staff: StaffTable }).from(AppointmentTable).innerJoin(StaffTable, eq(AppointmentTable.staffId, StaffTable.id)).all()
}

export async function updateAppointmentStatus(id: string, status: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED') {
  await db.update(AppointmentTable).set({ status }).where(eq(AppointmentTable.id, id))
  revalidatePath('/appointments')
}

// --- COMMAND CENTER AGGREGATOR ---

export async function getCommandCenterData() {
  const [beds, staff, shifts, equipment, events] = await Promise.all([
    db.select().from(BedTable).all(),
    db.select().from(StaffTable).all(),
    db.select().from(ShiftTable).where(eq(ShiftTable.status, 'ACTIVE')).all(),
    db.select().from(EquipmentTable).all(),
    db.select().from(WorkflowEventTable).orderBy(desc(WorkflowEventTable.createdAt)).limit(10).all()
  ])

  return {
    beds,
    staff: {
      total: staff.length,
      active: shifts.length
    },
    equipment: {
      total: equipment.length,
      inUse: equipment.filter(e => e.status === 'IN_USE').length
    },
    recentEvents: events
  }
}

// --- PATIENT ENGAGEMENT (PHR) ACTIONS ---

export async function getPatientFullHistory(patientId: string) {
  const [patient, notes, prescriptions, labOrders, vitals, billing] = await Promise.all([
    db.select().from(PatientTable).where(eq(PatientTable.id, patientId)).all(),
    db.select().from(ClinicalNotesTable).where(eq(ClinicalNotesTable.patientId, patientId)).orderBy(desc(ClinicalNotesTable.createdAt)).all(),
    db.select().from(PrescriptionTable).where(eq(PrescriptionTable.patientId, patientId)).all(),
    db.select({ order: LabOrderTable, result: LabResultTable })
      .from(LabOrderTable)
      .leftJoin(LabResultTable, eq(LabOrderTable.id, LabResultTable.orderId))
      .where(eq(LabOrderTable.patientId, patientId))
      .orderBy(desc(LabOrderTable.createdAt))
      .all(),
    db.select().from(VitalsTable).where(eq(VitalsTable.patientId, patientId)).orderBy(desc(VitalsTable.recordedAt)).all(),
    db.select().from(BillingTable).where(eq(BillingTable.patientId, patientId)).orderBy(desc(BillingTable.date)).all()
  ])

  return {
    patient: patient[0] || null,
    notes,
    prescriptions,
    labOrders,
    vitals,
    billing
  }
}

// --- AI TRIAGE LOGIC ---

export async function processSymptomTriage(symptoms: string) {
  const s = symptoms.toLowerCase()
  let score = 5
  let recommendation = 'HOME_CARE'
  let reason = 'Symptoms appear mild. Self-monitoring advised.'

  if (s.includes('chest pain') || s.includes('breathless') || s.includes('unconscious')) {
    score = 1
    recommendation = 'ER_IMMEDIATE'
    reason = 'Life-threatening indicators detected. Rapid Response required.'
  } else if (s.includes('bleeding') || s.includes('fracture') || s.includes('severe pain')) {
    score = 2
    recommendation = 'ER_URGENT'
    reason = 'Urgent injury/symptom detected. Proceed to Emergency.'
  } else if (s.includes('fever') || s.includes('infection') || s.includes('vomiting')) {
    score = 3
    recommendation = 'CLINIC_VISIT'
    reason = 'Signs of acute illness. Schedule OPD visit within 24h.'
  } else if (s.includes('cough') || s.includes('rash') || s.includes('headache')) {
    score = 4
    recommendation = 'OPD_ROUTINE'
    reason = 'Minor symptoms. Routine follow-up advised.'
  }

  return { score, recommendation, reason }
}
