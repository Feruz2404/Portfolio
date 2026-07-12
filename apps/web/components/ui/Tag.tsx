import { cn } from "@/components/ui/utils";

export function Tag({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-2xs font-medium uppercase tracking-wider",
        tone === "default" && "border-line bg-bone/[0.03] text-bone-muted",
        tone === "accent" && "border-accent/25 bg-accent/10 text-accent",
        tone === "muted" && "border-transparent bg-bone/5 text-bone-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
