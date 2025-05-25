"use client";

import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Loader({ className, size = "default", text = "Loading..." }) {
  const sizeClasses = {
    default: "w-6 h-6",
    sm: "w-4 h-4",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
} 