import * as React from "react";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandBar = ({ isOpen, onClose }: CommandBarProps) => {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="flex items-start justify-center pt-[20vh] px-4">
        <div className="command-bar w-full max-w-2xl p-4 animate-scale-in">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Command className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Go to Dashboard</div>
                  <div className="text-xs text-muted-foreground">Navigate to main dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CommandBar };