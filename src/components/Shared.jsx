export function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{eyebrow}</p>
        ) : null}
        <h3 className="mt-2 font-display text-3xl text-parchment">{title}</h3>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function GlassCard({ className = "", children }) {
  return (
    <div
      className={`min-w-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-glow backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function StatPill({ label, value, tone = "default" }) {
  const tones = {
    default: "border-white/10 bg-white/5 text-stone-100",
    warm: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    red: "border-red-500/20 bg-red-500/10 text-red-100",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
    blue: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  };

  return (
    <div className={`min-w-0 rounded-2xl border px-3 py-2 ${tones[tone]}`}>
      <p className="truncate text-[11px] uppercase tracking-[0.24em] text-stone-500" title={label}>{label}</p>
      <p className="mt-1 break-words text-lg font-semibold leading-6">{value}</p>
    </div>
  );
}

export function AvatarStack({ people }) {
  return (
    <div className="flex -space-x-2">
      {people.map((person) => (
        <div
          key={person.id ?? person.name}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/30 bg-gradient-to-br from-amber-500 to-red-800 text-sm font-semibold text-white"
          title={person.name}
        >
          {person.avatar}
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-2 rounded-full bg-white/8 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Tag({ children, tone = "default" }) {
  const tones = {
    default: "border-white/10 bg-white/5 text-stone-300",
    warm: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    red: "border-red-500/20 bg-red-500/10 text-red-100",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  };

  return (
    <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs leading-5 break-words ${tones[tone]}`}>{children}</span>
  );
}
