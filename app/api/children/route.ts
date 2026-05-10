import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      dateOfBirth,
      gender,
      schoolId,
      classGrade,
      section,
      allergies,
      dietaryPreferences,
      healthConditions,
      activityLevel,
    } = body

    if (!name || !dateOfBirth) {
      return NextResponse.json({ error: 'Name and date of birth are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO children (
        parent_id, name, date_of_birth, gender, school_id, class_grade, section,
        allergies, dietary_preferences, health_conditions, activity_level
      ) VALUES (
        ${session.id}, ${name}, ${dateOfBirth}, ${gender || null}, 
        ${schoolId || null}, ${classGrade || null}, ${section || null},
        ${allergies || []}, ${dietaryPreferences || ['vegetarian']}, 
        ${healthConditions || []}, ${activityLevel || 'moderate'}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, child: result[0] })
  } catch (error) {
    console.error('Create child error:', error)
    return NextResponse.json({ error: 'Failed to create child profile' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const children = await sql`
      SELECT c.*, s.name as school_name 
      FROM children c 
      LEFT JOIN schools s ON s.id = c.school_id 
      WHERE c.parent_id = ${session.id}
      ORDER BY c.created_at DESC
    `

    return NextResponse.json({ children })
  } catch (error) {
    console.error('Get children error:', error)
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 })
  }
}
