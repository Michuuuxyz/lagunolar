"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, className, id, ...props }, ref) => {
    const handleToggle = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-reptile-gold focus:ring-offset-2 focus:ring-offset-bg-darker",
          checked ? "bg-reptile-gold" : "bg-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          className
        )}
        {...props}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
