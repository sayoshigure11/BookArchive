// v0の自作？
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col">
        <div
          className={cn(
            "bg-background rounded-t-xl shadow-lg",
            "max-h-[90vh] overflow-y-auto",
            "animate-in slide-in-from-bottom duration-300"
          )}
        >
          <div className="sticky top-0 z-10 bg-background border-b border-border">
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
