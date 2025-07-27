import { ReactNode } from "react";
import { BarChart3, MessageSquare, ShoppingCart, Home, LogOut, Zap, Menu } from "lucide-react";
import { NavLink, useLocation, Navigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Inline Button component
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Inline Sidebar components - simplified version
function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  
  return (
    <div className="flex min-h-screen">
      <div className={cn("transition-all duration-300", open ? "w-64" : "w-16")}>
        <div className="h-full border-r bg-background">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === AppSidebar) {
              return React.cloneElement(child, { open, setOpen } as any);
            }
            return null;
          })}
        </div>
      </div>
      <div className="flex-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type !== AppSidebar) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}

function SidebarTrigger({ open, setOpen }: { open?: boolean; setOpen?: (open: boolean) => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setOpen?.(!open)}
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
}

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Feedback", url: "/feedback", icon: BarChart3 },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Auto-Reply", url: "/auto-reply", icon: MessageSquare },
];

function AppSidebar({ open, setOpen }: { open?: boolean; setOpen?: (open: boolean) => void }) {
  const location = useLocation();
  const { signOut } = useClerk();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {open && <span className="text-xl font-bold">D2C Booster</span>}
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink 
                to={item.url} 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.url) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", open ? "mr-2" : "")} />
                {open && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            open ? "justify-start" : "justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("h-4 w-4", open ? "mr-2" : "")} />
          {open && "Logout"}
        </Button>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Redirect to auth if not signed in
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <SidebarTrigger open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="ml-auto">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName || 'User'}!
              </span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 bg-slate-50">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}