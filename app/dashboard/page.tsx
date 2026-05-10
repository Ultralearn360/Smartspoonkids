import { getSession } from '@/lib/auth'
import { sql, formatINR, type Child, type Order, type Subscription, type Meal } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Package, TrendingUp, Plus, ArrowRight, Clock, CheckCircle2, Truck } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

async function getDashboardData(parentId: string) {
  const [children, activeSubscriptions, recentOrders, todaysMeals] = await Promise.all([
    sql`SELECT * FROM children WHERE parent_id = ${parentId} ORDER BY created_at DESC`,
    sql`SELECT s.*, c.name as child_name FROM subscriptions s 
        JOIN children c ON c.id = s.child_id 
        WHERE s.parent_id = ${parentId} AND s.status = 'active'`,
    sql`SELECT o.*, m.name as meal_name, c.name as child_name 
        FROM orders o 
        JOIN meals m ON m.id = o.meal_id 
        JOIN children c ON c.id = o.child_id
        WHERE o.parent_id = ${parentId} 
        ORDER BY o.order_date DESC LIMIT 5`,
    sql`SELECT m.* FROM meals m 
        JOIN daily_menu dm ON dm.meal_id = m.id 
        WHERE dm.menu_date = CURRENT_DATE AND dm.is_available = true 
        AND m.meal_type = 'lunch' AND m.is_vegetarian = true
        LIMIT 3`,
  ])

  return {
    children: children as Child[],
    activeSubscriptions: activeSubscriptions as (Subscription & { child_name: string })[],
    recentOrders: recentOrders as (Order & { meal_name: string; child_name: string })[],
    todaysMeals: todaysMeals as Meal[],
  }
}

const deliveryStatusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-muted text-muted-foreground' },
  preparing: { label: 'Preparing', icon: Clock, className: 'bg-amber-100 text-amber-700' },
  dispatched: { label: 'On the way', icon: Truck, className: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: Clock, className: 'bg-destructive/10 text-destructive' },
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const { children, activeSubscriptions, recentOrders, todaysMeals } = await getDashboardData(session.id)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, {session.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your children&apos;s meals today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4" />
              Children
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground">registered profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="size-4" />
              Active Plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package className="size-4" />
              This Month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">meals delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatINR(activeSubscriptions.length * 500)}</div>
            <p className="text-xs text-muted-foreground">vs daily ordering</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Children Section */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Children</CardTitle>
              <CardDescription>Manage profiles and preferences</CardDescription>
            </div>
            <Link href="/dashboard/children/add">
              <Button size="sm" variant="outline">
                <Plus className="size-4 mr-1" />
                Add
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-8">
                <Users className="size-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-4">No children added yet</p>
                <Link href="/dashboard/children/add">
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Your First Child
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {children.slice(0, 3).map((child) => (
                  <Link 
                    key={child.id} 
                    href={`/dashboard/children/${child.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {child.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {child.class_grade || 'No class assigned'}
                      </p>
                    </div>
                    <Badge variant={child.dietary_preferences?.includes('vegetarian') ? 'default' : 'secondary'}>
                      {child.dietary_preferences?.includes('vegetarian') ? 'Veg' : 'Non-Veg'}
                    </Badge>
                  </Link>
                ))}
                {children.length > 3 && (
                  <Link href="/dashboard/children">
                    <Button variant="ghost" className="w-full">
                      View all {children.length} children
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Menu */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Menu</CardTitle>
              <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
            </div>
            <Link href="/dashboard/menu">
              <Button variant="outline" size="sm">
                View Full Menu
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todaysMeals.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="size-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No meals scheduled for today</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {todaysMeals.map((meal) => (
                  <div key={meal.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={meal.is_vegetarian ? 'default' : 'secondary'} className="text-xs">
                        {meal.is_vegetarian ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{meal.calories} cal</span>
                    </div>
                    <h4 className="font-medium mb-1">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
                    <p className="text-primary font-semibold mt-2">{formatINR(Number(meal.price_inr))}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your meal deliveries</CardDescription>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              View All Orders
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="size-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Subscribe to a meal plan to start receiving nutritious meals
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => {
                const statusConfig = deliveryStatusConfig[order.delivery_status]
                const StatusIcon = statusConfig.icon
                return (
                  <div 
                    key={order.id} 
                    className="flex items-center gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className={`size-10 rounded-full flex items-center justify-center ${statusConfig.className}`}>
                      <StatusIcon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{order.meal_name}</p>
                      <p className="text-sm text-muted-foreground">
                        For {order.child_name} - {format(new Date(order.order_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge variant="outline" className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                    <span className="font-medium">{formatINR(Number(order.price_inr))}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
