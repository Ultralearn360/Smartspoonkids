import { getSession } from '@/lib/auth'
import { sql, calculateAge, type Child, type School } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, GraduationCap, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function getChildren(parentId: string) {
  const children = await sql`
    SELECT c.*, s.name as school_name 
    FROM children c 
    LEFT JOIN schools s ON s.id = c.school_id 
    WHERE c.parent_id = ${parentId} 
    ORDER BY c.created_at DESC
  `
  return children as (Child & { school_name: string | null })[]
}

export default async function ChildrenPage() {
  const session = await getSession()
  if (!session) return null

  const children = await getChildren(session.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Children</h1>
          <p className="text-muted-foreground">Manage your children&apos;s profiles and dietary preferences</p>
        </div>
        <Link href="/dashboard/children/add">
          <Button>
            <Plus className="size-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="size-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your children&apos;s profiles to customize their meal plans based on age, dietary preferences, and nutritional needs.
            </p>
            <Link href="/dashboard/children/add">
              <Button size="lg">
                <Plus className="size-5 mr-2" />
                Add Your First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => {
            const age = calculateAge(child.date_of_birth)
            const hasAllergies = child.allergies && child.allergies.length > 0
            
            return (
              <Card key={child.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                          {child.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{child.name}</CardTitle>
                        <CardDescription>{age} years old</CardDescription>
                      </div>
                    </div>
                    <Badge variant={child.dietary_preferences?.includes('vegetarian') ? 'default' : 'secondary'}>
                      {child.dietary_preferences?.includes('vegetarian') ? 'Vegetarian' : 'Non-Veg'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 text-sm">
                    {child.school_name && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="size-4" />
                        <span>{child.school_name}</span>
                        {child.class_grade && (
                          <span className="text-foreground">- Class {child.class_grade}</span>
                        )}
                      </div>
                    )}
                    {hasAllergies && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="size-4" />
                        <span>Allergies: {child.allergies?.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/children/${child.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </Link>
                    <Link href={`/dashboard/children/${child.id}/edit`} className="flex-1">
                      <Button variant="secondary" className="w-full">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
