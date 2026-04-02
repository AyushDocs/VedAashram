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

export async function GET(request: Request) {
  return handleRequest(request, {})
}

export async function POST(request: Request) {
  return handleRequest(request, {})
}
