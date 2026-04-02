/**
 * Veda-FHIR Mapping Utility
 * Bridges Internal Database Schema with HL7 FHIR Standards
 */

export interface FHIR_Patient {
  resourceType: 'Patient'
  id: string
  active: boolean
  name: Array<{
    use: string
    text: string
    family?: string
    given?: string[]
  }>
  telecom: Array<{
    system: 'phone' | 'email'
    value: string
    use: string
  }>
  gender: 'male' | 'female' | 'other' | 'unknown'
  birthDate: string
  address: Array<{
    use: string
    text: string
  }>
}

export interface FHIR_Observation {
  resourceType: 'Observation'
  id: string
  status: 'final' | 'preliminary'
  category: Array<{
    coding: Array<{ system: string, code: string, display: string }>
  }>
  code: {
    coding: Array<{ system: string, code: string, display: string }>
    text: string
  }
  subject: { reference: string }
  effectiveDateTime: string
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
}

export function mapToFHIRPatient(dbPatient: any): FHIR_Patient {
  return {
    resourceType: 'Patient',
    id: dbPatient.id,
    active: dbPatient.status !== 'DISCHARGED',
    name: [{
      use: 'official',
      text: dbPatient.name,
    }],
    telecom: dbPatient.phone ? [{
      system: 'phone',
      value: dbPatient.phone,
      use: 'mobile'
    }] : [],
    gender: (dbPatient.gender?.toLowerCase() as any) || 'unknown',
    birthDate: dbPatient.dob || '',
    address: dbPatient.address ? [{
      use: 'home',
      text: dbPatient.address
    }] : []
  }
}

export function mapToFHIRObservation(dbVitals: any): FHIR_Observation {
  // Mapping specific vital to LOINC (simplified)
  return {
    resourceType: 'Observation',
    id: dbVitals.id,
    status: 'final',
    category: [{
      coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }]
    }],
    code: {
      coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel with all components' }],
      text: 'Vital Signs Set'
    },
    subject: { reference: `Patient/${dbVitals.patientId}` },
    effectiveDateTime: dbVitals.recordedAt,
    // Note: Full FHIR Observations often separate BP, Temp, etc. 
    // For Veda-Core Lite, we summarize the NEWS2 relevant components.
  }
}
