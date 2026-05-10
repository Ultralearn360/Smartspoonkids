import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const child = await sql`
      SELECT c.*, s.name as school_name 
      FROM children c 
      LEFT JOIN schools s ON s.id = c.school_id 
      WHERE c.id = ${id} AND c.parent_id = ${session.id}
    `

    if (child.length === 0) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json({ child: child[0] })
  } catch (error) {
    console.error('Get child error:', error)
    return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const result = await sql`
      UPDATE children SET
        name = ${name},
        date_of_birth = ${dateOfBirth},
        gender = ${gender || null},
        school_id = ${schoolId || null},
        class_grade = ${classGrade || null},
        section = ${section || null},
        allergies = ${allergies || []},
        dietary_preferences = ${dietaryPreferences || ['vegetarian']},
        health_conditions = ${healthConditions || []},
        activity_level = ${activityLevel || 'moderate'},
        updated_at = NOW()
      WHERE id = ${id} AND parent_id = ${session.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, child: result[0] })
  } catch (error) {
    console.error('Update child error:', error)
    return NextResponse.json({ error: 'Failed to update child profile' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await sql`
      DELETE FROM children 
      WHERE id = ${id} AND parent_id = ${session.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete child error:', error)
    return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 })
  }
}
