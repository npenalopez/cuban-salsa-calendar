import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-800 text-white [a&]:hover:bg-gray-900",
        secondary:
          "border-transparent bg-gray-100 text-gray-700 [a&]:hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-700",
        outline:
          "text-gray-700 border-gray-300 [a&]:hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };
