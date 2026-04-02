import { getCurrentUser } from '../actions'
import StaffClient from './StaffClient'
import { redirect } from 'next/navigation'

export default async function StaffPage() {
  const user = await getCurrentUser()
  
  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return <StaffClient />
}
