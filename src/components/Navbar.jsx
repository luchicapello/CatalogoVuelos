import { Plane } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 shadow-md font-sans">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold">
            <Plane 
                className="size-5"
            />
          </span>
          <span className="text-primary font-semibold tracking-tight">
            FlyCatalog
          </span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          {[
            { key: "/vuelos/nuevo", label: "Alta de Vuelos" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(t.key)}
              className={`px-3 py-1.5 rounded-xl transition border cursor-pointer ${
                location.pathname === t.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "hover:bg-primary/20 border-transparent"
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
