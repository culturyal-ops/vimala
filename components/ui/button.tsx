import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-xs font-medium uppercase tracking-[0.18em] transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-crimson text-white hover:bg-crimson-light hover:-translate-y-0.5 active:translate-y-0",
        sharp:
          "bg-ink text-white hover:bg-crimson hover:-translate-y-0.5 active:translate-y-0",
        sharpOutline:
          "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
        ghost:
          "border border-slate-dark bg-transparent text-ink hover:border-ink hover:bg-ink/5",
        gold: "bg-gold-muted text-ink hover:bg-gold hover:-translate-y-0.5",
        ivory: "bg-white text-ink border border-slate hover:bg-surface",
        outline:
          "border-2 border-crimson text-crimson bg-transparent hover:bg-crimson hover:text-white",
        link: "text-crimson underline-offset-4 hover:underline",
      },
      size: {
        default: "px-8 py-3.5 h-12",
        sm: "px-5 py-2.5 text-[10px] h-10",
        lg: "px-10 py-4 text-xs h-14",
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
