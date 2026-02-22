import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:wing-focus disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-bg shadow-glow hover:shadow-glowStrong hover:brightness-105 hover:scale-[1.02] active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-panel border border-stroke text-text shadow-ring hover:bg-panel2 hover:border-stroke2 hover:shadow-card hover:scale-[1.01] active:scale-[0.99]",
        secondary:
          "bg-panel2 text-text border border-stroke hover:bg-panel hover:border-stroke2",
        ghost:
          "text-muted hover:text-text rounded-xl",
        link:
          "text-pink underline-offset-4 hover:underline",
        soft:
          "bg-pink/10 text-pink border border-pink/20 hover:bg-pink/15 hover:border-pink/30",
      },
      size: {
        default: "h-11 px-s4 py-s2",
        sm:      "h-9 rounded-xl px-s3 text-xs",
        lg:      "h-12 rounded-2xl px-s5 text-base",
        xl:      "h-14 rounded-3xl px-s6 text-lg",
        icon:    "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
