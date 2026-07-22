import { cn } from "@/components/ui/utils";

/** Renders plain-text content (with blank-line paragraph breaks) as prose. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className={cn("flex flex-col gap-4 leading-relaxed text-bone-muted", className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
