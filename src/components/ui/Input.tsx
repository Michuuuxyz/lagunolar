import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = "left", error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-bg-card px-3 py-2 text-sm text-white transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-darker",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus:ring-error"
              : "border-gray-800 focus:border-reptile-gold focus:ring-reptile-gold/50",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
