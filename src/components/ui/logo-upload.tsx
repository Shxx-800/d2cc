import * as React from "react";
import { Upload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
  onLogoChange?: (logo: string | null) => void;
  className?: string;
}

const LogoUpload = ({ onLogoChange, className }: LogoUploadProps) => {
  const [logo, setLogo] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
        onLogoChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeLogo = () => {
    setLogo(null);
    onLogoChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      {logo ? (
        <div className="relative group">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto max-w-[120px] object-contain rounded-lg"
          />
          <button
            onClick={removeLogo}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/80"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "h-10 w-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-muted/30",
            isDragging && "border-primary bg-primary/10"
          )}
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Image className="h-4 w-4" />
            <span className="text-xs font-medium">Logo</span>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />
    </div>
  );
};

export { LogoUpload };