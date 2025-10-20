import { useState, useMemo, useEffect } from "react";
import Pill from "../components/Pill";
import Field from "../components/Field";
import SelectAirport from "../components/SelectAirport";
import Navbar from "../components/Navbar";
import { ArrowLeftRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AIRLINES } from "../constants/airports";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
    maxPrice: 200000,
    airline: "",
    sort: "price",
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use static airlines list instead of dynamic from API
  const airlines = AIRLINES;

  // Helper function to format flight status
  const formatFlightStatus = (status) => {
    const statusMap = {
      'EN_HORA': 'En Hora',
      'CONFIRMADO': 'Confirmado',
      'DEMORADO': 'Demorado',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Helper function to get status variant for Pill
  const getStatusVariant = (status) => {
    const variantMap = {
      'EN_HORA': 'success',
      'CONFIRMADO': 'info',
      'DEMORADO': 'warning',
      'CANCELADO': 'error'
    };
    return variantMap[status] || 'default';
  };

  


  // Function to change flight status
  const changeFlightStatus = async (flightId, newStatus) => {
    try {
      // Confirmación especial para cancelar vuelos
      if (newStatus === 'CANCELADO') {
        const confirmed = window.confirm('¿Estás seguro de que quieres cancelar este vuelo? Esta acción no se puede deshacer.');
        if (!confirmed) {
          return; // No hacer nada si el usuario cancela
        }
      }

      console.log(`Cambiando vuelo ${flightId} a estado: ${newStatus}`);

      // Llamada a la API para actualizar el estado
      await api.changeFlightStatus(flightId, newStatus);

      // Actualizar el estado local después de la llamada exitosa
      setFlights(prevFlights =>
        prevFlights.map(flight =>
          flight.id === flightId
            ? { ...flight, estadoVuelo: newStatus }
            : flight
        )
      );

      console.log(`Estado del vuelo ${flightId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error al cambiar estado del vuelo:', error);
      // Aquí podrías mostrar un toast o mensaje de error al usuario
      alert('Error al cambiar el estado del vuelo. Por favor, intenta de nuevo.');
    }
  };


  // Fetch flights on component mount
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getFlights();
        setFlights(data);
      } catch (err) {
        setError("Error al cargar los vuelos. Por favor, intenta de nuevo.");
        console.error("Error fetching flights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const results = useMemo(() => {
    if (!Array.isArray(flights)) return [];

    let list = flights.filter((f) => {
      const matchesFrom = query.from ? f.origen === query.from : true;
      const matchesTo = query.to ? f.destino === query.to : true;
      // Extract date from despegue field for comparison
      const flightDate = f.despegue ? new Date(f.despegue).toISOString().split('T')[0] : '';
      const matchesDate = query.date ? flightDate === query.date : true;
      const matchesPrice = f.precio <= query.maxPrice;
      const matchesAirline = query.airline
        ? f.aerolinea === query.airline
        : true;

      return (
        matchesFrom &&
        matchesTo &&
        matchesDate &&
        matchesPrice &&
        matchesAirline
      );
    });

    if (query.sort === "price") list.sort((a, b) => a.precio - b.precio);
    if (query.sort === "date")
      list.sort((a, b) => new Date(a.despegue) - new Date(b.despegue));
    if (query.sort === "status") {
      const statusOrder = { 'EN_HORA': 1, 'CONFIRMADO': 2, 'DEMORADO': 3, 'CANCELADO': 4 };
      list.sort((a, b) => (statusOrder[a.estadoVuelo] || 5) - (statusOrder[b.estadoVuelo] || 5));
    }

    return list;
  }, [flights, query]);

  function toMinutes(flight) {
    // Calculate duration from departure and arrival times
    const departure = new Date(flight.despegue);
    const arrival = new Date(flight.aterrizajeLocal);
    const diffMs = arrival - departure;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes;
  }

  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  function swap() {
    setQuery((q) => ({ ...q, from: q.to, to: q.from }));
  }

  function clearAll() {
    setQuery({
      from: "",
      to: "",
      date: "",
      maxPrice: 200000,
      airline: "",
      sort: "price",
    });
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 py-8 font-sans bg-gray-900 text-gray-100 min-h-screen">
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold tracking-tight flex justify-center items-center text-white">
              <Search
                className="inline-block mr-1"
                strokeWidth={1}
              />{" "}
              Buscar vuelos
            </h1>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-2xl">
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
                className="h-11 w-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-300 flex items-center justify-center hover:bg-gray-600 hover:text-white cursor-pointer transition"
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

            <div className="grid md:grid-cols-3 grid-cols-1 gap-3 col-span-full">
              <Field label="Fecha">
                <input
                  type="date"
                  value={query.date}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, date: e.target.value }))
                  }
                  className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </Field>
              <Field label="Aerolínea">
                <select
                  value={query.airline}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, airline: e.target.value }))
                  }
                  className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                  className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="price">Precio</option>
                  <option value="date">Fecha</option>
                  <option value="status">Estado</option>
                </select>
              </Field>
            </div>

            <div className="col-span-full flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3 h-11 rounded-xl border border-gray-600 px-4 bg-gray-700 text-gray-200 flex-1 max-w-md">
                <span className="text-sm text-gray-300 whitespace-nowrap">Precio máx:</span>
                <input
                  type="range"
                  min="200000"
                  max="1000000"
                  step="100000"
                  value={query.maxPrice}
                  onChange={(e) =>
                    setQuery((q) => ({
                      ...q,
                      maxPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-gray-500"
                />
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  ${query.maxPrice}
                </span>
              </div>
              <button
                onClick={clearAll}
                className="px-6 h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white cursor-pointer transition font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Resultados ({results.length})
            </h2>
            <p className="text-sm text-gray-400">
              Mostrando resultados en base a tus filtros.
            </p>
          </div>

          {loading && (
            <div className="text-center text-gray-400 py-12 border border-gray-700 rounded-2xl bg-gray-800">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
              Cargando vuelos...
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 py-12 border border-red-600 rounded-2xl bg-red-900/20">
              <p className="mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <ul className="grid gap-3">
              {results.map((f) => (
                <li
                  key={f.id}
                  className="rounded-2xl p-3 sm:p-4 bg-gray-800 border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg hover:bg-gray-750 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-600 text-gray-200 flex items-center justify-center text-sm font-semibold">
                      {f.aerolinea[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {f.aerolinea}
                      </div>
                      <div className="text-sm text-gray-400">
                        {f.origen} → {f.destino} · {new Date(f.despegue).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {f.idVuelo} · {f.tipoAvion}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Pill>{formatDuration(toMinutes(f))}</Pill>

                    <Pill variant={getStatusVariant(f.estadoVuelo)}>
                      {formatFlightStatus(f.estadoVuelo)}
                    </Pill>
                    {/*
                    {f.estadoVuelo !== 'CANCELADO' ? (
                      <select
                        value={f.estadoVuelo}
                        onChange={(e) => changeFlightStatus(f.id, e.target.value)}
                        className="inline-flex items-center justify-center rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium whitespace-nowrap min-w-[80px] cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: f.estadoVuelo === 'EN_HORA' ? '#065f46' :
                                         f.estadoVuelo === 'DEMORADO' ? '#92400e' : '#374151',
                          borderColor: f.estadoVuelo === 'EN_HORA' ? '#10b981' :
                                     f.estadoVuelo === 'DEMORADO' ? '#f59e0b' : '#6b7280',
                          color: f.estadoVuelo === 'EN_HORA' ? '#6ee7b7' :
                                f.estadoVuelo === 'DEMORADO' ? '#fbbf24' : '#d1d5db'
                        }}
                      >
                        <option value="EN_HORA">En Hora</option>
                        <option value="DEMORADO">Demorado</option>
                        <option value="CANCELADO" style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancelado</option>
                      </select>
                    ) : (
                      <Pill variant={getStatusVariant(f.estadoVuelo)}>
                        {formatFlightStatus(f.estadoVuelo)}
                      </Pill>
                    )}
                    */
                    }
                    <Pill className="hidden sm:inline-flex">{f.capacidadAvion} asientos</Pill>
                    <div className="text-right flex flex-col sm:block">
                      <div className="text-lg sm:text-xl font-semibold text-white">
                        {f.moneda} {f.precio.toLocaleString()}
                      </div>
                      <button
                        className="mt-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-xl bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white transition cursor-pointer border border-gray-600"
                        onClick={() => navigate(`/vuelos/${f.id}`, { state: { flight: f } })}
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {results.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-12 border border-gray-700 rounded-2xl bg-gray-800">
                  No encontramos vuelos con esos filtros. Probá ajustándolos.
                </div>
              )}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
