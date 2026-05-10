import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export type Parent = {
  id: string
  email: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  pincode: string | null
  created_at: string
  updated_at: string
}

export type Child = {
  id: string
  parent_id: string
  name: string
  date_of_birth: string
  gender: string | null
  school_id: string | null
  class_grade: string | null
  section: string | null
  allergies: string[] | null
  dietary_preferences: string[] | null
  health_conditions: string[] | null
  activity_level: string
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

export type School = {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  contact_phone: string | null
  delivery_time: string
  is_active: boolean
  created_at: string
}

export type Meal = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  meal_type: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  is_vegetarian: boolean
  is_vegan: boolean
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  fiber_grams: number | null
  ingredients: string[] | null
  allergens: string[] | null
  age_group: string
  price_inr: number
  is_active: boolean
  created_at: string
}

export type Subscription = {
  id: string
  parent_id: string
  child_id: string
  plan_type: 'daily' | 'weekly' | 'monthly'
  meal_type: 'lunch' | 'lunch_snack' | 'full_day'
  start_date: string
  end_date: string | null
  price_inr: number
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  paused_at: string | null
  resume_date: string | null
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  parent_id: string
  child_id: string
  subscription_id: string | null
  meal_id: string | null
  order_date: string
  delivery_status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled'
  delivery_time: string | null
  price_inr: number
  notes: string | null
  created_at: string
  updated_at: string
}

export type MealFeedback = {
  id: string
  order_id: string
  parent_id: string
  child_id: string
  rating: number | null
  taste_rating: number | null
  portion_rating: number | null
  comment: string | null
  created_at: string
}

// Helper to format INR currency
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper to calculate age from date of birth
export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Helper to get age group
export function getAgeGroup(age: number): string {
  if (age >= 4 && age <= 6) return '4-6'
  if (age >= 7 && age <= 10) return '7-10'
  if (age >= 11 && age <= 16) return '11-16'
  return 'all'
}
