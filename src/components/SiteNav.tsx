import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", label: "Home", icon: "✦" },
  { to: "/games", label: "Games", icon: "🧩" },
  { to: "/collection", label: "Collection", icon: "🎁" },
  { to: "/gallery", label: "Gallery", icon: "📷" },
  { to: "/letters", label: "Letters", icon: "✉️" },
] as const;

export function SiteNav() {
  return (
    <>
      <nav className="rise flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="nav-sparkle text-lg leading-none text-rose">✦</span>
          <span className="font-hand text-2xl text-ink">Little Something</span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full bg-cream/70 p-1 ring-1 ring-ink/5 sm:flex">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              activeOptions={{ exact: true }}
              className="nav-link rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              activeProps={{ className: "bg-ink !text-cream font-semibold" }}
            >
              {i.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-5 gap-1 px-3 py-2">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              activeOptions={{ exact: true }}
               className="nav-link flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-ink-soft"
              activeProps={{ className: "bg-blush !text-ink" }}
            >
              <span className="text-lg">{i.icon}</span>
              <span className="text-[11px] font-semibold">{i.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
