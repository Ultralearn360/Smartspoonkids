import { cookies } from 'next/headers'
import { sql, type Parent } from './db'

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate a secure session token
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Create or update OTP for email
export async function createOTP(email: string): Promise<string> {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // Delete any existing OTPs for this email
  await sql`DELETE FROM otp_verifications WHERE email = ${email}`

  // Create new OTP
  await sql`
    INSERT INTO otp_verifications (email, otp_code, expires_at)
    VALUES (${email}, ${otp}, ${expiresAt.toISOString()})
  `

  return otp
}

// Verify OTP
export async function verifyOTP(email: string, otpCode: string): Promise<boolean> {
  const result = await sql`
    SELECT id FROM otp_verifications
    WHERE email = ${email}
    AND otp_code = ${otpCode}
    AND expires_at > NOW()
    AND verified = false
  `

  if (result.length === 0) return false

  // Mark as verified
  await sql`
    UPDATE otp_verifications
    SET verified = true
    WHERE email = ${email} AND otp_code = ${otpCode}
  `

  return true
}

// Create session for parent
export async function createSession(parentId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await sql`
    INSERT INTO sessions (parent_id, token, expires_at)
    VALUES (${parentId}, ${token}, ${expiresAt.toISOString()})
  `

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return token
}

// Get current session
export async function getSession(): Promise<Parent | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return null

  const result = await sql`
    SELECT p.* FROM parents p
    JOIN sessions s ON s.parent_id = p.id
    WHERE s.token = ${token}
    AND s.expires_at > NOW()
  `

  return (result[0] as Parent) || null
}

// Destroy session
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (token) {
    await sql`DELETE FROM sessions WHERE token = ${token}`
  }

  cookieStore.delete('session_token')
}

// Find or create parent by email
export async function findOrCreateParent(email: string, name: string): Promise<Parent> {
  // Try to find existing parent
  const existing = await sql`
    SELECT * FROM parents WHERE email = ${email}
  `

  if (existing.length > 0) {
    return existing[0] as Parent
  }

  // Create new parent
  const result = await sql`
    INSERT INTO parents (email, name)
    VALUES (${email}, ${name})
    RETURNING *
  `

  return result[0] as Parent
}
