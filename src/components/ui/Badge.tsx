import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-reptile-gold/20 text-reptile-gold border border-reptile-gold/30",
        gold: "bg-reptile-gold/20 text-reptile-gold border border-reptile-gold/30",
        amber: "bg-reptile-amber/20 text-reptile-amber border border-reptile-amber/30",
        success: "bg-success/20 text-success border border-success/30",
        warning: "bg-warning/20 text-warning border border-warning/30",
        error: "bg-error/20 text-error border border-error/30",
        info: "bg-info/20 text-info border border-info/30",
        outline: "text-gray-400 border border-gray-700",
        secondary: "bg-bg-card text-gray-300 border border-gray-800",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
