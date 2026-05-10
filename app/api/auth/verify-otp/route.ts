import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyOTP, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    // Verify OTP
    const isValid = await verifyOTP(email.toLowerCase(), otp)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Check if parent exists
    const existing = await sql`SELECT * FROM parents WHERE email = ${email.toLowerCase()}`
    
    if (existing.length > 0) {
      // Existing user - create session
      await createSession(existing[0].id)
      return NextResponse.json({ 
        success: true, 
        isNewUser: false,
        parent: existing[0]
      })
    }

    // New user - don't create session yet, they need to provide name
    return NextResponse.json({ 
      success: true, 
      isNewUser: true 
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
