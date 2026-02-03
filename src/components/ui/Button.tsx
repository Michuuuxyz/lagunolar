import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-reptile-gold disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-gold text-white hover:scale-105 hover:shadow-gold-lg animate-pulse-glow",
        gold: "bg-reptile-gold text-black hover:bg-reptile-amber hover:scale-105 shadow-gold font-semibold",
        amber: "bg-reptile-amber text-white hover:bg-reptile-gold hover:scale-105 shadow-gold",
        outline: "border-2 border-reptile-gold text-reptile-gold hover:bg-reptile-gold/10 hover:scale-105",
        ghost: "hover:bg-bg-card text-gray-300 hover:text-white",
        destructive: "bg-error text-white hover:bg-error/90 hover:scale-105",
        success: "bg-success text-white hover:bg-success/90 hover:scale-105",
        link: "text-reptile-gold underline-offset-4 hover:underline hover:text-reptile-amber",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
