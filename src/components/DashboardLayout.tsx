import { ReactNode, useState } from "react";
import { BarChart3, MessageSquare, ShoppingCart, Home, LogOut, Zap, Menu, Search, User, Settings, Command } from "lucide-react";
import { NavLink, useLocation, Navigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { LogoUpload } from "@/components/ui/logo-upload";
import { CommandBar } from "@/components/ui/command-bar";
import * as React from "react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Feedback", url: "/feedback", icon: BarChart3 },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Auto-Reply", url: "/auto-reply", icon: MessageSquare },
];

function AppSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const { signOut } = useClerk();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className={cn(
      "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
            <Zap className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center space-x-3 min-w-0">
              <span className="text-xl font-bold text-sidebar-foreground">D2C Booster</span>
              <LogoUpload className="ml-auto" />
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink 
                to={item.url} 
                className={cn(
                  "group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  isActive(item.url) 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-300",
                  isCollapsed ? "" : "mr-3",
                  isActive(item.url) ? "text-white" : "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
                {isActive(item.url) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-sidebar-accent/50">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-semibold">
              P
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Pro Plan</p>
              <p className="text-xs text-sidebar-foreground/60">14 days left</p>
            </div>
          </div>
        )}
        
        <button 
          className={cn(
            "w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Redirect to auth if not signed in
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-pulse">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <AppSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border flex items-center px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Bar */}
            <button
              onClick={() => setCommandBarOpen(true)}
              className="hidden sm:flex items-center space-x-3 bg-muted/50 hover:bg-muted transition-all duration-300 rounded-xl px-4 py-2 text-muted-foreground hover:text-foreground min-w-[300px] group"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search anything...</span>
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-background/50 rounded text-xs font-mono">⌘</kbd>
                <kbd className="px-2 py-1 bg-background/50 rounded text-xs font-mono">K</kbd>
              </div>
            </button>
          </div>
          
          {/* Right Side */}
          <div className="ml-auto flex items-center space-x-3">
            <ThemeToggle />
            <NotificationDropdown />
            
            {/* Profile Dropdown */}
            <div className="flex items-center space-x-3 pl-3 border-l border-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-semibold shadow-glow cursor-pointer transition-all duration-300 hover:scale-105">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                </div>
                <div className="status-online" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Command Bar */}
      <CommandBar 
        isOpen={commandBarOpen} 
        onClose={() => setCommandBarOpen(false)} 
      />

      {/* Mobile FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center text-white sm:hidden z-40 hover:scale-110 transition-all duration-300">
        <Search className="h-6 w-6" />
      </button>
    </div>
  );
}