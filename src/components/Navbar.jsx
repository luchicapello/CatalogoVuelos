export default function Navbar({ current, setCurrent }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold">
            ✈️
          </span>
          <span className="font-semibold tracking-tight">FlyCatalog</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          {[
            { key: "home", label: "Home" },
            { key: "login", label: "Login" },
            { key: "signup", label: "Signup" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setCurrent(t.key)}
              className={`px-3 py-1.5 rounded-xl transition border ${
                current === t.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "hover:bg-gray-100 border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
