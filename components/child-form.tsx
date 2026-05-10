'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { School, Child } from '@/lib/db'

const allergyOptions = [
  'Dairy',
  'Eggs',
  'Peanuts',
  'Tree Nuts',
  'Wheat/Gluten',
  'Soy',
  'Fish',
  'Shellfish',
]

const healthConditions = [
  'Diabetes',
  'Lactose Intolerance',
  'Celiac Disease',
  'Food Allergies',
  'Obesity',
  'Underweight',
]

type ChildFormProps = {
  schools: School[]
  parentId: string
  child?: Child
}

export function ChildForm({ schools, parentId, child }: ChildFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: child?.name || '',
    dateOfBirth: child?.date_of_birth?.split('T')[0] || '',
    gender: child?.gender || '',
    schoolId: child?.school_id || '',
    classGrade: child?.class_grade || '',
    section: child?.section || '',
    allergies: child?.allergies || [],
    dietaryPreferences: child?.dietary_preferences || ['vegetarian'],
    healthConditions: child?.health_conditions || [],
    activityLevel: child?.activity_level || 'moderate',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url = child 
        ? `/api/children/${child.id}` 
        : '/api/children'
      
      const res = await fetch(url, {
        method: child ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save child profile')
      }

      router.push('/dashboard/children')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleArrayItem = (field: 'allergies' | 'healthConditions', item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Link href="/dashboard/children">
        <Button variant="ghost" type="button">
          <ArrowLeft className="size-4 mr-2" />
          Back to Children
        </Button>
      </Link>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter your child&apos;s basic details</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter child's name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Sedentary)</SelectItem>
                  <SelectItem value="moderate">Moderate (Active)</SelectItem>
                  <SelectItem value="high">High (Very Active)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Select your child&apos;s school for meal delivery</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="school">School</Label>
            <Select
              value={formData.schoolId}
              onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name} - {school.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="class">Class/Grade</Label>
              <Select
                value={formData.classGrade}
                onValueChange={(value) => setFormData({ ...formData, classGrade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)].map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A, B, C"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
          <CardDescription>Select your child&apos;s food preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.dietaryPreferences.includes('vegetarian')}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    dietaryPreferences: checked 
                      ? ['vegetarian'] 
                      : ['non-vegetarian'],
                  })
                }}
              />
              <span>Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.dietaryPreferences.includes('non-vegetarian')}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    dietaryPreferences: checked 
                      ? ['non-vegetarian'] 
                      : ['vegetarian'],
                  })
                }}
              />
              <span>Non-Vegetarian</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Select any food allergies your child has</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {allergyOptions.map((allergy) => (
              <label key={allergy} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.allergies.includes(allergy)}
                  onCheckedChange={() => toggleArrayItem('allergies', allergy)}
                />
                <span className="text-sm">{allergy}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Health Conditions</CardTitle>
          <CardDescription>Select any health conditions to consider for meal planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {healthConditions.map((condition) => (
              <label key={condition} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.healthConditions.includes(condition)}
                  onCheckedChange={() => toggleArrayItem('healthConditions', condition)}
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Link href="/dashboard/children">
          <Button variant="outline" type="button">Cancel</Button>
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            child ? 'Update Profile' : 'Add Child'
          )}
        </Button>
      </div>
    </form>
  )
}
