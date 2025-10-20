import { Plane } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-gray-900 border-b border-gray-700 shadow-2xl font-sans">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-700 border border-gray-600 text-gray-200 font-bold shadow-lg">
            <Plane className="size-5" />
          </span>
          <span className="text-white font-bold tracking-tight text-xl">
            FlyCatalog
          </span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {[
            { key: "/home", label: "Buscar Vuelos", shortLabel: "Buscar" },
            { key: "/vuelos/nuevo", label: "Alta de Vuelos", shortLabel: "Alta" }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(t.key)}
              className={`px-2 sm:px-4 py-2 rounded-xl transition border cursor-pointer font-medium ${
                location.pathname === t.key
                  ? "bg-gray-700 text-white border-gray-600 shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white border-gray-600 hover:border-gray-500"
              }`}
            >
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
