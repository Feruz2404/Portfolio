/**
 * Premium static fallback for the hero 3D scene — a CSS/SVG "atelier" schematic.
 * Rendered on SSR, for reduced-motion / constrained devices, and whenever the
 * live scene fails. No canvas, no JS animation required to look intentional.
 */
export default function HeroPoster({ alt }: { alt?: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label={alt}
    >
      {/* Ambient depth wash (obsidian → faint accent, restrained violet) */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_60%_40%,rgba(47,227,194,0.10),transparent_60%),radial-gradient(50%_50%_at_30%_75%,rgba(139,123,240,0.08),transparent_65%)]" />
      <div className="atelier-grid absolute inset-0 opacity-70" aria-hidden />

      {/* Schematic composition: modular panels + data nodes + connecting paths */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(242,239,230,0.06)" />
            <stop offset="1" stopColor="rgba(242,239,230,0.02)" />
          </linearGradient>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(47,227,194,0.7)" />
            <stop offset="1" stopColor="rgba(52,211,153,0.5)" />
          </linearGradient>
        </defs>

        {/* connecting paths */}
        <g stroke="rgba(47,227,194,0.35)" strokeWidth="1" fill="none">
          <path d="M120 150 L215 110" />
          <path d="M215 110 L285 175" />
          <path d="M120 150 L165 250" />
          <path d="M165 250 L285 175" />
          <path d="M165 250 L250 285" />
        </g>

        {/* modular panels */}
        <g>
          <rect x="86" y="118" width="92" height="64" rx="8" fill="url(#panel)" stroke="rgba(242,239,230,0.12)" />
          <rect x="185" y="80" width="78" height="52" rx="8" fill="url(#panel)" stroke="rgba(242,239,230,0.12)" />
          <rect x="248" y="150" width="86" height="60" rx="8" fill="url(#panel)" stroke="rgba(242,239,230,0.12)" />
          <rect x="132" y="222" width="70" height="48" rx="8" fill="url(#panel)" stroke="rgba(242,239,230,0.12)" />
          {/* accent bar hinting the FZ mark on the primary panel */}
          <rect x="96" y="128" width="34" height="5" rx="2.5" fill="url(#edge)" />
          <rect x="96" y="140" width="22" height="4" rx="2" fill="rgba(242,239,230,0.25)" />
          <rect x="96" y="150" width="46" height="4" rx="2" fill="rgba(242,239,230,0.15)" />
        </g>

        {/* data nodes */}
        <g>
          {[
            [120, 150],
            [215, 110],
            [285, 175],
            [165, 250],
            [250, 285],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="8" fill="rgba(47,227,194,0.12)" />
              <circle cx={cx} cy={cy} r="3.2" fill="#2FE3C2" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
