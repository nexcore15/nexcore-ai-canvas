/** Pixflow AI mark — a prism/aperture built from gradient flow ribbons. */
export function PixflowMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Pixflow AI" className={className}>
      <defs>
        <linearGradient id="pf-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.22 296)" />
          <stop offset="100%" stopColor="oklch(0.84 0.15 200)" />
        </linearGradient>
        <linearGradient id="pf-grad-2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.84 0.15 200)" />
          <stop offset="100%" stopColor="oklch(0.72 0.22 296)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#pf-grad)" opacity="0.16" />
      <rect
        x="2.75"
        y="2.75"
        width="42.5"
        height="42.5"
        rx="12.25"
        fill="none"
        stroke="url(#pf-grad)"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M16 34V14h9.5a6.5 6.5 0 0 1 0 13H21"
        fill="none"
        stroke="url(#pf-grad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 20.5c4.6 1.1 6.8 3.3 6.8 6.4 0 3.6-3 6.6-7.6 6.6"
        fill="none"
        stroke="url(#pf-grad-2)"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="33.5" cy="15.5" r="2.4" fill="url(#pf-grad-2)" />
    </svg>
  );
}

export function PixflowWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-lg font-semibold tracking-tight ${className}`}>
      Pixflow <span className="gradient-text">AI</span>
    </span>
  );
}
