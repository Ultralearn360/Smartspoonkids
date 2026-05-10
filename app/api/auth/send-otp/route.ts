import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createOTP } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const existing = await sql`SELECT id FROM parents WHERE email = ${email.toLowerCase()}`
    const isNewUser = existing.length === 0

    // Create OTP
    const otp = await createOTP(email.toLowerCase())

    // In production, send email via service like Resend/SendGrid
    // For now, log to console for testing
    console.log(`[SmartSpoon] OTP for ${email}: ${otp}`)

    return NextResponse.json({ 
      success: true, 
      isNewUser,
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
