import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peace-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl",
        destructive: "bg-red-700 text-destructive-foreground hover:bg-red-600",
        outline:
          "border border-slate-600 bg-slate-700/20 text-slate-800 hover:bg-slate-600/30",
        secondary:
          "bg-slate-600 text-white hover:bg-slate-500 shadow-lg border border-slate-500",
        ghost: "hover:bg-slate-200 text-slate-800",
        link: "text-slate-700 underline-offset-4 hover:underline hover:text-slate-600",
        comfort:
          "bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 shadow-lg",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-lg",
        sm: "h-9 rounded-md px-4 py-2",
        lg: "h-12 rounded-xl px-8 py-3",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
