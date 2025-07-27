import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/store/useStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, Star, Users, ShoppingCart, DollarSign, Package, ArrowUp, ArrowDown, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

// Modern Card Component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-modern", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Modern Badge Component
const Badge = ({ className, children, variant = "default", ...props }: {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}) => {
  const variants = {
    default: "bg-primary/20 text-primary border-primary/30",
    success: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    destructive: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
      variants[variant],
      className
    )} {...props}>
      {children}
    </div>
  );
};

// Chart Container Component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, any>
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full h-[300px]", className)}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-3 shadow-2xl">
        <p className="font-medium text-foreground">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span className="font-medium" style={{ color: item.color }}>{item.name}:</span> {item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Dashboard = () => {
  const { orders, feedback } = useStore();

  // Calculate analytics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const avgOrderValue = totalRevenue / totalOrders || 0;
  
  const topProduct = orders.reduce((acc, order) => {
    acc[order.product] = (acc[order.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostOrderedProduct = Object.entries(topProduct).sort(([,a], [,b]) => b - a)[0]?.[0] || "No orders yet";
  
  const mostComplaints = feedback.filter(f => f.sentiment === 'Negative').reduce((acc, fb) => {
    acc[fb.product] = (acc[fb.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostComplainedProduct = Object.entries(mostComplaints).sort(([,a], [,b]) => b - a)[0]?.[0] || "No complaints";
  
  const repeatCustomers = new Set(orders.map(o => o.customer)).size;

  // Chart data
  const ratingDistribution = [
    { rating: "5★", count: feedback.filter(f => f.rating === 5).length, fill: "#10b981" },
    { rating: "4★", count: feedback.filter(f => f.rating === 4).length, fill: "#3b82f6" },
    { rating: "3★", count: feedback.filter(f => f.rating === 3).length, fill: "#f59e0b" },
    { rating: "2★", count: feedback.filter(f => f.rating === 2).length, fill: "#ef4444" },
    { rating: "1★", count: feedback.filter(f => f.rating === 1).length, fill: "#dc2626" },
  ];

  const sentimentData = [
    { name: "Positive", value: feedback.filter(f => f.sentiment === 'Positive').length, fill: "#10b981" },
    { name: "Neutral", value: feedback.filter(f => f.sentiment === 'Neutral').length, fill: "#f59e0b" },
    { name: "Negative", value: feedback.filter(f => f.sentiment === 'Negative').length, fill: "#ef4444" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12500, orders: 45 },
    { month: "Feb", revenue: 15200, orders: 52 },
    { month: "Mar", revenue: 18900, orders: 68 },
    { month: "Apr", revenue: 22100, orders: 74 },
    { month: "May", revenue: 25300, orders: 89 },
    { month: "Jun", revenue: 28700, orders: 95 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string | number;
    change: string;
    icon: any;
    trend: 'up' | 'down';
  }) => (
    <Card className="hover-lift group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <div className="flex items-center space-x-1">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-success" />
              ) : (
                <ArrowDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' ? "text-success" : "text-destructive"
              )}>
                {change}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-all duration-300">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Welcome Back!</h1>
            <p className="text-lg text-muted-foreground">Here's what's happening with your brand today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="success" className="animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
            <Badge>
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% Growth
            </Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Top Product"
            value={mostOrderedProduct.length > 15 ? mostOrderedProduct.substring(0, 15) + "..." : mostOrderedProduct}
            change="+8.2%"
            icon={Star}
            trend="up"
          />
          <StatCard
            title="Most Complaints"
            value={mostComplainedProduct.length > 15 ? mostComplainedProduct.substring(0, 15) + "..." : mostComplainedProduct}
            change="-2.1%"
            icon={Package}
            trend="down"
          />
          <StatCard
            title="Repeat Buyers"
            value={repeatCustomers}
            change="+15.3%"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${avgOrderValue.toFixed(0)}`}
            change="+5.2%"
            icon={DollarSign}
            trend="up"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trend */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Revenue Growth</span>
              </CardTitle>
              <CardDescription>
                Monthly revenue and order trends over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(147 51 234)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgb(147 51 234)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(39 39 50)" />
                  <XAxis dataKey="month" stroke="rgb(156 163 175)" />
                  <YAxis stroke="rgb(156 163 175)" />
                  <ChartTooltip content={<ChartTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="rgb(147 51 234)" 
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Customer Sentiment */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>Customer Sentiment</span>
              </CardTitle>
              <CardDescription>
                Overall sentiment breakdown from customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    stroke="rgb(15 15 20)"
                    strokeWidth={2}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltip />} />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center mt-6 space-x-6">
                {sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span>Product Ratings Distribution</span>
            </CardTitle>
            <CardDescription>
              Distribution of feedback ratings across all products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <BarChart data={ratingDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(39 39 50)" />
                <XAxis dataKey="rating" stroke="rgb(156 163 175)" />
                <YAxis stroke="rgb(156 163 175)" />
                <ChartTooltip content={<ChartTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]}
                  stroke="rgb(15 15 20)"
                  strokeWidth={1}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Frequently used actions to manage your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="btn-ghost-modern text-left p-4 space-y-2 hover-lift">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">View Orders</p>
                  <p className="text-xs text-muted-foreground">Manage recent orders</p>
                </div>
              </button>
              <button className="btn-ghost-modern text-left p-4 space-y-2 hover-lift">
                <BarChart3 className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-xs text-muted-foreground">View detailed reports</p>
                </div>
              </button>
              <button className="btn-ghost-modern text-left p-4 space-y-2 hover-lift">
                <MessageSquare className="w-6 h-6 text-success" />
                <div>
                  <p className="font-medium">Auto-Reply</p>
                  <p className="text-xs text-muted-foreground">Configure responses</p>
                </div>
              </button>
              <button className="btn-ghost-modern text-left p-4 space-y-2 hover-lift">
                <Users className="w-6 h-6 text-warning" />
                <div>
                  <p className="font-medium">Customers</p>
                  <p className="text-xs text-muted-foreground">Manage customer data</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;