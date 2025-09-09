import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pill from "../components/Pill";
import { SAMPLE_FLIGHTS } from "../data/flights";

export default function DetalleVuelo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const flight = useMemo(() => {
    const numericId = Number(id);
    return SAMPLE_FLIGHTS.find((f) => f.id === numericId);
  }, [id]);

  if (!flight) {
    return (
      <>
        <Navbar />
        <main className="mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto border rounded-2xl bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Vuelo no encontrado</h1>
            <p className="text-gray-600 mb-6">No pudimos encontrar el vuelo solicitado.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 h-11 rounded-xl border hover:bg-primary/20 cursor-pointer transition"
            >
              Volver
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 py-10">
        <section className="max-w-3xl mx-auto bg-[#fbfbfb] rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-semibold">
                {flight.airline[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-tight">{flight.airline}</h1>
                <p className="text-sm text-gray-600">
                  {flight.from} → {flight.to} · {flight.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">${flight.price}</div>
              <div className="text-xs text-gray-600">por pasajero</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill>{flight.duration}</Pill>
            <Pill>{flight.stops === 0 ? "Directo" : `${flight.stops} escala${flight.stops > 1 ? "s" : ""}`}</Pill>
            <Pill>{flight.cabin}</Pill>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-2xl bg-white p-4">
              <div className="text-sm text-gray-600">Origen</div>
              <div className="font-medium text-lg">{flight.from}</div>
            </div>
            <div className="border rounded-2xl bg-white p-4">
              <div className="text-sm text-gray-600">Destino</div>
              <div className="font-medium text-lg">{flight.to}</div>
            </div>
            <div className="border rounded-2xl bg-white p-4">
              <div className="text-sm text-gray-600">Fecha</div>
              <div className="font-medium text-lg">{flight.date}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 h-11 rounded-xl border hover:bg-primary/20 cursor-pointer transition"
            >
              Volver
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
