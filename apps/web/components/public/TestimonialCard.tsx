export type TestimonialCardData = {
  name: string;
  position?: string | null;
  company?: string | null;
  content: string;
};

export function TestimonialCard({ testimonial }: { testimonial: TestimonialCardData }) {
  const attribution = [testimonial.position, testimonial.company].filter(Boolean).join(" · ");
  return (
    <figure className="flex h-full flex-col rounded-lg border border-line bg-ink-850/60 p-6">
      <span aria-hidden className="font-display text-4xl leading-none text-accent">“</span>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-bone-muted">
        {testimonial.content}
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-4">
        <div className="text-sm font-semibold text-bone">{testimonial.name}</div>
        {attribution ? <div className="mt-0.5 text-xs text-bone-faint">{attribution}</div> : null}
      </figcaption>
    </figure>
  );
}
