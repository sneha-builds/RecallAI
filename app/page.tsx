import { redirect } from 'next/navigation'

export default function RootPage() {
  // For now, redirect to dashboard
  // In a real app, check auth status and redirect accordingly
  redirect('/dashboard')
}
