import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    // Verify that OTP was previously verified for this email
    const otpRecord = await sql`
      SELECT id FROM otp_verifications 
      WHERE email = ${email.toLowerCase()} 
      AND verified = true 
      AND created_at > NOW() - INTERVAL '30 minutes'
    `

    if (otpRecord.length === 0) {
      return NextResponse.json({ error: 'Please verify your email first' }, { status: 400 })
    }

    // Check if parent already exists
    const existing = await sql`SELECT id FROM parents WHERE email = ${email.toLowerCase()}`
    
    if (existing.length > 0) {
      // Parent already exists, just create session
      await createSession(existing[0].id)
      return NextResponse.json({ success: true })
    }

    // Create new parent
    const result = await sql`
      INSERT INTO parents (email, name)
      VALUES (${email.toLowerCase()}, ${name.trim()})
      RETURNING *
    `

    // Create session
    await createSession(result[0].id)

    // Clean up used OTP records
    await sql`DELETE FROM otp_verifications WHERE email = ${email.toLowerCase()}`

    return NextResponse.json({ 
      success: true, 
      parent: result[0] 
    })
  } catch (error) {
    console.error('Complete signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
