import { createSchema } from 'graphql-yoga'
import { db } from '@/db'
import { PatientTable, VitalsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { mapToFHIRPatient, mapToFHIRObservation } from '@/lib/fhir'

const typeDefs = `
  type Query {
    patient(id: ID!): Patient
    patients: [Patient]
    observation(id: ID!): Observation
  }

  type Patient {
    resourceType: String
    id: ID
    active: Boolean
    name: [PatientName]
    telecom: [PatientTelecom]
    gender: String
    birthDate: String
    address: [PatientAddress]
  }

  type PatientName {
    use: String
    text: String
  }

  type PatientTelecom {
    system: String
    value: String
    use: String
  }

  type PatientAddress {
    use: String
    text: String
  }

  type Observation {
    resourceType: String
    id: ID
    status: String
    effectiveDateTime: String
    subject: PatientReference
  }

  type PatientReference {
    reference: String
  }
`

const resolvers = {
  Query: {
    patient: async (_: any, { id }: { id: string }) => {
      const data = await db.select().from(PatientTable).where(eq(PatientTable.id, id)).all()
      return data[0] ? mapToFHIRPatient(data[0]) : null
    },
    patients: async () => {
      const data = await db.select().from(PatientTable).all()
      return data.map(mapToFHIRPatient)
    },
    observation: async (_: any, { id }: { id: string }) => {
       const data = await db.select().from(VitalsTable).where(eq(VitalsTable.id, id)).all()
       return data[0] ? mapToFHIRObservation(data[0]) : null
    }
  }
}

export const schema = createSchema({
  typeDefs,
  resolvers
})
