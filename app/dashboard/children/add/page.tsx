import { getSession } from '@/lib/auth'
import { sql, type School } from '@/lib/db'
import { ChildForm } from '@/components/child-form'

async function getSchools() {
  const schools = await sql`SELECT * FROM schools WHERE is_active = true ORDER BY name`
  return schools as School[]
}

export default async function AddChildPage() {
  const session = await getSession()
  if (!session) return null

  const schools = await getSchools()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add Child</h1>
        <p className="text-muted-foreground">
          Create a profile for your child to personalize their meal experience
        </p>
      </div>

      <ChildForm schools={schools} parentId={session.id} />
    </div>
  )
}
