import { useState, useMemo } from "react";
import Pill from "../components/Pill";
import Field from "../components/Field";
import SelectAirport from "../components/SelectAirport";
import Navbar from "../components/Navbar";
import { ArrowLeftRight, Search } from "lucide-react";

export const SAMPLE_FLIGHTS = [
  {
    id: 1,
    from: "EZE",
    to: "SCL",
    date: "2025-10-10",
    airline: "Aerolíneas Argentinas",
    price: 210,
    duration: "2h 15m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 2,
    from: "AEP",
    to: "GRU",
    date: "2025-10-12",
    airline: "LATAM",
    price: 320,
    duration: "3h 05m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 3,
    from: "EZE",
    to: "MIA",
    date: "2025-11-03",
    airline: "American Airlines",
    price: 780,
    duration: "9h 00m",
    stops: 0,
    cabin: "Premium Economy",
  },
  {
    id: 4,
    from: "EZE",
    to: "MAD",
    date: "2025-11-20",
    airline: "Iberia",
    price: 930,
    duration: "12h 10m",
    stops: 1,
    cabin: "Economy",
  },
  {
    id: 5,
    from: "SCL",
    to: "EZE",
    date: "2025-12-01",
    airline: "Sky Airline",
    price: 190,
    duration: "2h 10m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 6,
    from: "GRU",
    to: "EZE",
    date: "2025-10-28",
    airline: "GOL",
    price: 260,
    duration: "2h 25m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 7,
    from: "JFK",
    to: "MAD",
    date: "2025-12-15",
    airline: "Iberia",
    price: 640,
    duration: "7h 20m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 8,
    from: "BCN",
    to: "FCO",
    date: "2025-10-21",
    airline: "Vueling",
    price: 120,
    duration: "1h 40m",
    stops: 0,
    cabin: "Economy",
  },
  {
    id: 9,
    from: "LAX",
    to: "JFK",
    date: "2025-11-07",
    airline: "Delta",
    price: 410,
    duration: "5h 30m",
    stops: 0,
    cabin: "Economy",
  },
];

export default function Home() {
  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
    cabin: "",
    nonstop: false,
    maxPrice: 1000,
    airline: "",
    sort: "price",
  });

  const airlines = useMemo(
    () => Array.from(new Set(SAMPLE_FLIGHTS.map((f) => f.airline))),
    []
  );

  const results = useMemo(() => {
    let list = SAMPLE_FLIGHTS.filter((f) => {
      const matchesFrom = query.from ? f.from === query.from : true;
      const matchesTo = query.to ? f.to === query.to : true;
      const matchesDate = query.date ? f.date === query.date : true;
      const matchesCabin = query.cabin ? f.cabin === query.cabin : true;
      const matchesStops = query.nonstop ? f.stops === 0 : true;
      const matchesPrice = f.price <= query.maxPrice;
      const matchesAirline = query.airline ? f.airline === query.airline : true;
      return (
        matchesFrom &&
        matchesTo &&
        matchesDate &&
        matchesCabin &&
        matchesStops &&
        matchesPrice &&
        matchesAirline
      );
    });

    if (query.sort === "price") list.sort((a, b) => a.price - b.price);
    if (query.sort === "duration")
      list.sort((a, b) => toMinutes(a.duration) - toMinutes(b.duration));
    if (query.sort === "date")
      list.sort((a, b) => a.date.localeCompare(b.date));

    return list;
  }, [query]);

  function toMinutes(d) {
    // format: "Xh Ym"
    const [h, m] = d.replace("m", "").split("h ");
    return parseInt(h) * 60 + parseInt(m);
  }

  function swap() {
    setQuery((q) => ({ ...q, from: q.to, to: q.from }));
  }

  function clearAll() {
    setQuery({
      from: "",
      to: "",
      date: "",
      cabin: "",
      nonstop: false,
      maxPrice: 1000,
      airline: "",
      sort: "price",
    });
  }

  return (
    <>
      <Navbar />
      <main className=" mx-auto px-4 py-8 font-sans">
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold tracking-tight flex justify-center items-center">
              <Search className="inline-block mr-1" strokeWidth={1} /> Buscar vuelos
            </h1>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end bg-[#fbfbfb] rounded-2xl p-4 shadow-md">
            <Field label="Origen">
              <SelectAirport
                value={query.from}
                onChange={(v) => setQuery((q) => ({ ...q, from: v }))}
                placeholder="Seleccioná el aeropuerto"
              />
            </Field>

            <div className="flex justify-center pb-2 md:pb-0">
              <button
                onClick={swap}
                className="h-11 w-11 rounded-xl border flex items-center justify-center hover:bg-primary/20 cursor-pointer transition"
                title="Invertir"
              >
                <ArrowLeftRight strokeWidth={1} />
              </button>
            </div>

            <Field label="Destino">
              <SelectAirport
                value={query.to}
                onChange={(v) => setQuery((q) => ({ ...q, to: v }))}
                placeholder="Seleccioná el aeropuerto"
              />
            </Field>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-3 col-span-full">
              <Field label="Fecha">
                <input
                  type="date"
                  value={query.date}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, date: e.target.value }))
                  }
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                />
              </Field>
              <Field label="Cabina">
                <select
                  value={query.cabin}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, cabin: e.target.value }))
                  }
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Cualquiera</option>
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </Field>
              <Field label="Aerolínea">
                <select
                  value={query.airline}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, airline: e.target.value }))
                  }
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Todas</option>
                  {airlines.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Ordenar por">
                <select
                  value={query.sort}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, sort: e.target.value }))
                  }
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="price">Precio</option>
                  <option value="duration">Duración</option>
                  <option value="date">Fecha</option>
                </select>
              </Field>
            </div>

            <div className="col-span-full grid md:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 h-11 rounded-xl border px-3 bg-white">
                <input
                  type="checkbox"
                  checked={query.nonstop}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, nonstop: e.target.checked }))
                  }
                />
                Solo vuelos directos
              </label>
              <div className="flex items-center gap-3 h-11 rounded-xl border px-3 bg-white">
                <span className="text-sm text-gray-600">Precio máx:</span>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="10"
                  value={query.maxPrice}
                  onChange={(e) =>
                    setQuery((q) => ({
                      ...q,
                      maxPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <span className="text-sm font-medium">${query.maxPrice}</span>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={clearAll}
                  className="px-4 h-11 rounded-xl border hover:bg-primary/20 cursor-pointer transition"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Resultados ({results.length})
            </h2>
            <p className="text-sm text-gray-600">
              Mostrando resultados en base a tus filtros.
            </p>
          </div>

          <ul className="grid gap-3">
            {results.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl p-4 bg-[#fbfbfb] flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                    {f.airline[0]}
                  </div>
                  <div>
                    <div className="font-medium">{f.airline}</div>
                    <div className="text-sm text-gray-600">
                      {f.from} → {f.to} · {f.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Pill>{f.duration}</Pill>
                  <Pill>{f.stops === 0 ? "Directo" : `${f.stops} escala`}</Pill>
                  <Pill>{f.cabin}</Pill>
                  <div className="text-right">
                    <div className="text-xl font-semibold">${f.price}</div>
                    <button className="mt-1 text-sm px-3 py-1.5 rounded-xl bg-gray-900 text-white">
                      Seleccionar
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {results.length === 0 && (
              <div className="text-center text-gray-600 py-12 border rounded-2xl bg-white">
                No encontramos vuelos con esos filtros. Probá ajustándolos.
              </div>
            )}
          </ul>
        </section>
      </main>
    </>
  );
}
