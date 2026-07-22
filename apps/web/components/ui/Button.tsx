import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/components/ui/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-all duration-fast ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-ink-950 hover:bg-accent-soft hover:shadow-accent active:translate-y-px",
        secondary:
          "border border-line-strong bg-transparent text-bone hover:border-accent/50 hover:text-accent",
        ghost: "text-bone-muted hover:text-bone hover:bg-bone/5",
        subtle: "bg-bone/5 text-bone hover:bg-bone/10 border border-line",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & Variants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Locale-aware internal link styled as a button. */
export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: ComponentProps<typeof Link> & Variants) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

/** External link styled as a button (secure by default). */
export function ButtonAnchor({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"a"> & Variants) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}
