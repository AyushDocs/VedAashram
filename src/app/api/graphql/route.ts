import { createYoga } from 'graphql-yoga'
import { schema } from './schema'

/**
 * HL7 FHIR GraphQL Processor
 * Powered by GraphQL-Yoga for Next.js App Router
 */

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST }
