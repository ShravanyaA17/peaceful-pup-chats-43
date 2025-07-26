import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peace-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-peace-purple/90 text-primary-foreground hover:bg-peace-purple shadow-gentle hover:shadow-comfort",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-peace-purple/40 bg-peace-purple/5 text-peace-purple hover:bg-peace-purple/15",
        secondary:
          "bg-gradient-gentle text-peace-text-soft hover:opacity-85 shadow-gentle border border-peace-purple/10",
        ghost: "hover:bg-peace-lavender/60 text-peace-text-soft",
        link: "text-peace-purple underline-offset-4 hover:underline hover:text-peace-purple/80",
        comfort: "bg-gradient-peace text-primary-foreground hover:bg-gradient-peace/90 shadow-comfort",
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
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
