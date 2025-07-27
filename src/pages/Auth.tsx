import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useUser, SignIn, SignUp } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Button component inline
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
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

// Card components inline
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
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
    className={cn("flex flex-col space-y-1.5 p-6", className)}
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
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
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
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  // Redirect if user is already logged in
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading spinner while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Info */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold">D2C Booster</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">
            Manage your D2C brand like a pro.
          </h1>
          
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Unlock insights, streamline operations, and boost engagement.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time feedback analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Automated order management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Smart DM automation</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-accent/30 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">D2C Booster</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center space-x-2 mb-6">
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(true)}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              variant={!showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          <Card className="card-modern">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {showLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {showLogin 
                  ? "Enter your credentials to access your account." 
                  : "Create your new account to get started."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {showLogin ? (
                  <SignIn 
                    redirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0",
                        card: "shadow-none border-none bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border border-border hover:bg-muted transition-colors",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                        formFieldInput: "border-border focus:border-primary",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                  />
                ) : (
                  <SignUp 
                    redirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0",
                        card: "shadow-none border-none bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border border-border hover:bg-muted transition-colors",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                        formFieldInput: "border-border focus:border-primary",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                  />
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {showLogin ? "New to D2C Booster?" : "Already have an account?"}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => setShowLogin(!showLogin)}
                  className="text-primary hover:text-primary/80 p-0 h-auto"
                >
                  {showLogin ? "Create an account" : "Sign in instead"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;