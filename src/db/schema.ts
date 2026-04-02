import { integer, sqliteTable, text, real, primaryKey } from 'drizzle-orm/sqlite-core'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

// User
export const UserTable = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role', { enum: ['DOCTOR', 'NURSE', 'ADMIN', 'PATIENT'] }).notNull().default('PATIENT'),
})

export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>

// Staff
export const StaffTable = sqliteTable('Staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role', { enum: ['DOCTOR', 'NURSE', 'ADMIN'] }).notNull(),
  specialty: text('specialty'),
  email: text('email').notNull(),
  phone: text('phone'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
})

export type Staff = InferSelectModel<typeof StaffTable>
export type InsertStaff = InferInsertModel<typeof StaffTable>

// Bed
export const BedTable = sqliteTable('Bed', {
  id: text('id').primaryKey(),
  status: text('status', { enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'] })
    .notNull()
    .default('AVAILABLE'),
  ward: text('ward').notNull(),
  floor: text('floor').notNull(),
  room: text('room').notNull(),
  department: text('department').notNull(),
  lastCleaned: text('lastCleaned'),
})

export type Bed = InferSelectModel<typeof BedTable>
export type InsertBed = InferInsertModel<typeof BedTable>

// Patient
export const PatientTable = sqliteTable('Patient', {
  id: text('id').primaryKey(),
  mrn: text('mrn').notNull().unique(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  status: text('status', { enum: ['CRITICAL', 'STABLE', 'RECOVERY', 'OBSERVATION'] }).notNull(),
  diagnosis: text('diagnosis'),
  icdCode: text('icdCode'), // Primary ICD-10
  secondaryIcdCodes: text('secondaryIcdCodes'), // CSV
  bloodGroup: text('bloodGroup'),
  allergies: text('allergies'),
  chronicConditions: text('chronicConditions'),
  tags: text('tags'),
  bedId: text('bedId').references(() => BedTable.id),
  admissionDate: text('admissionDate'),
  triageLevel: integer('triageLevel'),
  isEmergency: integer('isEmergency', { mode: 'boolean' }).default(false), 
  arrivalTime: text('arrivalTime'),
  emergencyContact: text('emergencyContact'),
})

export type Patient = InferSelectModel<typeof PatientTable>
export type InsertPatient = InferInsertModel<typeof PatientTable>

// Shift
export const ShiftTable = sqliteTable('Shift', {
  id: text('id').primaryKey(),
  staffId: text('staffId')
    .notNull()
    .references(() => StaffTable.id),
  checkIn: text('checkIn').notNull(),
  checkOut: text('checkOut'),
  status: text('status', { enum: ['ACTIVE', 'COMPLETED'] })
    .notNull()
    .default('ACTIVE'),
})

export type Shift = InferSelectModel<typeof ShiftTable>
export type InsertShift = InferInsertModel<typeof ShiftTable>

// Vitals (Time-series)
export const VitalsTable = sqliteTable('Vitals', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => PatientTable.id),
  staffId: text('staffId').notNull().references(() => StaffTable.id),
  recordedAt: text('recordedAt').notNull(),
  heartRate: integer('heartRate'),
  bpSystolic: integer('bpSystolic'),
  bpDiastolic: integer('bpDiastolic'),
  temp: real('temp'),
  spO2: integer('spO2'),
  respiratoryRate: integer('respiratoryRate'),
  nursingNote: text('nursingNote'),
})

export type Vitals = InferSelectModel<typeof VitalsTable>
export type InsertVitals = InferInsertModel<typeof VitalsTable>

// Prescriptions
export const PrescriptionTable = sqliteTable('Prescription', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => PatientTable.id),
  doctorId: text('doctorId').notNull().references(() => StaffTable.id),
  drugName: text('drugName').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  route: text('route').notNull(),
  startDate: text('startDate').notNull(),
  endDate: text('endDate'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  notes: text('notes'),
})

export type Prescription = InferSelectModel<typeof PrescriptionTable>
export type InsertPrescription = InferInsertModel<typeof PrescriptionTable>

// Medication Administration Record (MAR)
export const MedicationAdminTable = sqliteTable('MedicationAdmin', {
  id: text('id').primaryKey(),
  prescriptionId: text('prescriptionId').notNull().references(() => PrescriptionTable.id),
  nurseId: text('nurseId').notNull().references(() => StaffTable.id),
  administeredAt: text('administeredAt').notNull(),
  status: text('status', { enum: ['GIVEN', 'REFUSED', 'MISSED'] }).notNull(),
  notes: text('notes'),
})

export type MedicationAdmin = InferSelectModel<typeof MedicationAdminTable>
export type InsertMedicationAdmin = InferInsertModel<typeof MedicationAdminTable>

// Clinical Notes (SOAP Format)
export const ClinicalNotesTable = sqliteTable('ClinicalNotes', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => PatientTable.id),
  staffId: text('staffId').notNull().references(() => StaffTable.id),
  type: text('type', { enum: ['SOAP', 'PROGRESS', 'DISCHARGE', 'REFERRAL'] }).notNull(),
  icdCode: text('icdCode'), // Standardized Diagnosis
  subjective: text('subjective'),
  objective: text('objective'),
  assessment: text('assessment'),
  plan: text('plan'),
  createdAt: text('createdAt').notNull(),
})

export type ClinicalNote = InferSelectModel<typeof ClinicalNotesTable>
export type InsertClinicalNote = InferInsertModel<typeof ClinicalNotesTable>

// Pharmacy Inventory
export const PharmacyInventoryTable = sqliteTable('PharmacyInventory', {
  id: text('id').primaryKey(),
  drugName: text('drugName').notNull(),
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit').notNull(), // mg, tab, ml, box
  batchNumber: text('batchNumber'),
  expiryDate: text('expiryDate'),
  reorderLevel: integer('reorderLevel').notNull().default(10),
})

export type PharmacyInventory = InferSelectModel<typeof PharmacyInventoryTable>
export type InsertPharmacyInventory = InferInsertModel<typeof PharmacyInventoryTable>

// Lab Orders & Results (LIS)
export const LabOrderTable = sqliteTable('LabOrder', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => PatientTable.id),
  staffId: text('staffId').notNull().references(() => StaffTable.id),
  testName: text('testName').notNull(),
  category: text('category', { enum: ['BLOOD', 'URINE', 'STOOL', 'RADIOLOGY', 'CARDIOLOGY'] }).notNull(),
  status: text('status', { enum: ['PENDING', 'COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED'] }).notNull().default('PENDING'),
  notes: text('notes'),
  createdAt: text('createdAt').notNull(),
})

export type LabOrder = InferSelectModel<typeof LabOrderTable>
export type InsertLabOrder = InferInsertModel<typeof LabOrderTable>

export const LabResultTable = sqliteTable('LabResult', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull().references(() => LabOrderTable.id),
  resultJson: text('resultJson').notNull(), // Structured result data
  verifiedBy: text('verifiedBy').references(() => StaffTable.id),
  updatedAt: text('updatedAt').notNull(),
})

export type LabResult = InferSelectModel<typeof LabResultTable>
export type InsertLabResult = InferInsertModel<typeof LabResultTable>

// Billing (Automated Transaction Log)
export const BillingTable = sqliteTable('Billing', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => PatientTable.id),
  itemName: text('itemName').notNull(),
  category: text('category', { enum: ['BED', 'LAB', 'CONSULTATION', 'PHARMACY', 'PROCEDURE'] }).notNull(),
  amount: real('amount').notNull(),
  status: text('status', { enum: ['PENDING', 'PAID', 'CANCELLED'] }).notNull().default('PENDING'),
  date: text('date').notNull(),
})

export type Billing = InferSelectModel<typeof BillingTable>
export type InsertBilling = InferInsertModel<typeof BillingTable>

// Appointment (Through Ordex)
export const AppointmentTable = sqliteTable('Appointment', {
  id: text('id').primaryKey(),
  patientName: text('patientName').notNull(),
  staffId: text('staffId')
    .notNull()
    .references(() => StaffTable.id),
  date: text('date').notNull(),
  time: text('time').notNull(),
  type: text('type', { enum: ['CONSULTATION', 'PROCEDURE', 'FOLLOWUP', 'EMERGENCY'] }).notNull(),
  status: text('status', { enum: ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'] })
    .notNull()
    .default('SCHEDULED'),
  notes: text('notes'),
})

export type Appointment = InferSelectModel<typeof AppointmentTable>
export type InsertAppointment = InferInsertModel<typeof AppointmentTable>

// --- PHASE 2.5: ASSET TRACKING ---

// Medical Equipment
export const EquipmentTable = sqliteTable('Equipment', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['VENTILATOR', 'ECG', 'DEFIBRILLATOR', 'SYRINGE_PUMP', 'MONITOR', 'OTHER'] }).notNull(),
  status: text('status', { enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'FAULTY'] }).notNull().default('AVAILABLE'),
  serialNumber: text('serialNumber').unique(),
  lastMaintenance: text('lastMaintenance'), // ISO Date
})

export type Equipment = InferSelectModel<typeof EquipmentTable>
export type InsertEquipment = InferInsertModel<typeof EquipmentTable>

// Asset Assignments
export const AssetAssignmentTable = sqliteTable('AssetAssignment', {
  id: text('id').primaryKey(),
  equipmentId: text('equipmentId').notNull().references(() => EquipmentTable.id),
  patientId: text('patientId').references(() => PatientTable.id), // Nullable if returned
  assignedBy: text('assignedBy').notNull().references(() => StaffTable.id),
  startTime: text('startTime').notNull(),
  endTime: text('endTime'),
  status: text('status', { enum: ['ACTIVE', 'RELEASED'] }).notNull().default('ACTIVE'),
})

export type AssetAssignment = InferSelectModel<typeof AssetAssignmentTable>
export type InsertAssetAssignment = InferInsertModel<typeof AssetAssignmentTable>

// --- PHASE 4: AUTOMATION & ANALYTICS ---

// Workflow Events (The Event Bus)
export const WorkflowEventTable = sqliteTable('WorkflowEvent', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['LOW_STOCK', 'BED_RELEASED', 'STAT_LAB_DELAY', 'CRITICAL_VITALS', 'DISCHARGE_PENDING'] }).notNull(),
  severity: text('severity', { enum: ['INFO', 'WARNING', 'CRITICAL'] }).notNull().default('INFO'),
  metadata: text('metadata'), // JSON string with IDs/details
  status: text('status', { enum: ['PENDING', 'PROCESSED', 'FAILED'] }).notNull().default('PENDING'),
  createdAt: text('createdAt').notNull(),
})

export type WorkflowEvent = InferSelectModel<typeof WorkflowEventTable>
export type InsertWorkflowEvent = InferInsertModel<typeof WorkflowEventTable>

// Automation Logs
export const AutomationLogTable = sqliteTable('AutomationLog', {
  id: text('id').primaryKey(),
  eventId: text('eventId').notNull().references(() => WorkflowEventTable.id),
  actionTaken: text('actionTaken').notNull(),
  output: text('output'),
  executedAt: text('executedAt').notNull(),
})

export type AutomationLog = InferSelectModel<typeof AutomationLogTable>
export type InsertAutomationLog = InferInsertModel<typeof AutomationLogTable>
