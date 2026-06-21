import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body text-[10px] font-medium uppercase tracking-[0.22em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rouge focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "border border-ink bg-ink text-parchment hover:bg-rouge hover:border-rouge",
        sharp:
          "border border-ink bg-ink text-parchment hover:bg-rouge hover:border-rouge",
        sharpOutline:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-parchment",
        ghost:
          "border border-slate-dark bg-transparent text-ink hover:border-ink hover:bg-ink/5",
        gold: "border border-antique bg-antique-pale text-ink hover:bg-antique hover:border-antique-muted",
        ivory: "border border-slate bg-parchment text-ink hover:border-ink",
        outline:
          "border border-rouge bg-transparent text-rouge hover:bg-rouge hover:text-parchment",
        link: "text-rouge underline-offset-4 hover:underline border-0 p-0",
      },
      size: {
        default: "px-8 py-3.5 h-12",
        sm: "px-5 py-2.5 text-[9px] h-10",
        lg: "px-10 py-4 text-[10px] h-14",
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
