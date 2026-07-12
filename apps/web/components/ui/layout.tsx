import { createElement } from "react";
import { cn } from "@/components/ui/utils";

type Width = "prose" | "content" | "wide" | "full";

const widthMap: Record<Width, string> = {
  prose: "max-w-prose",
  content: "max-w-content",
  wide: "max-w-wide",
  full: "max-w-screen-full",
};

export function Container({
  as = "div",
  width = "content",
  className,
  children,
}: {
  as?: React.ElementType;
  width?: Width;
  className?: string;
  children: React.ReactNode;
}) {
  return createElement(
    as,
    { className: cn("mx-auto w-full px-6 md:px-8", widthMap[width], className) },
    children,
  );
}

export function Section({
  id,
  className,
  width = "content",
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  width?: Width;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <Container width={width} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", className)}>
      <span aria-hidden className="h-px w-6 bg-accent/60" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as = "h2",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {createElement(
        as,
        { className: "text-4xl font-semibold tracking-tight text-bone md:text-5xl" },
        title,
      )}
      {intro ? (
        <p
          className={cn(
            "max-w-prose text-base leading-relaxed text-bone-muted md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
