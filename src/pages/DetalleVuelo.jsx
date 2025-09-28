import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pill from "../components/Pill";

export default function DetalleVuelo() {
  const navigate = useNavigate();
  const location = useLocation();
  const flight = location.state?.flight;

  // Helper function to calculate duration
  const calculateDuration = (departure, arrival) => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const diffMs = arrivalDate - departureDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (!flight) {
    return (
      <>
        <Navbar />
        <main className="mx-auto px-4 py-12 bg-gray-900 min-h-screen">
          <div className="max-w-xl mx-auto border border-gray-700 rounded-2xl bg-gray-800 p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2 text-gray-100">Vuelo no encontrado</h1>
            <p className="text-gray-400 mb-6">No se pudo obtener la información del vuelo.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer transition"
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
      <main className="mx-auto px-4 py-10 bg-gray-900 min-h-screen">
        <section className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6 border border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-700 text-gray-200 flex items-center justify-center text-base font-semibold border border-gray-600">
                {flight.aerolinea[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-tight text-gray-100">{flight.aerolinea}</h1>
                <p className="text-sm text-gray-400">
                  {flight.origen} → {flight.destino} · {formatDate(flight.despegue)}
                </p>
                <p className="text-xs text-gray-500">
                  Vuelo: {flight.idVuelo}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-100">{flight.moneda} {flight.precio.toLocaleString()}</div>
              <div className="text-xs text-gray-400">por pasajero</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill>{calculateDuration(flight.despegue, flight.aterrizajeLocal)}</Pill>
            <Pill>{flight.tipoAvion}</Pill>
            <Pill variant={getStatusVariant(flight.estadoVuelo)}>
              {formatFlightStatus(flight.estadoVuelo)}
            </Pill>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-600 rounded-2xl bg-gray-700 p-4">
              <div className="text-sm text-gray-400">Origen</div>
              <div className="font-medium text-lg text-gray-100">{flight.origen}</div>
              <div className="text-sm text-gray-400">
                Despegue: {formatTime(flight.despegue)} UTC
              </div>
            </div>
            <div className="border border-gray-600 rounded-2xl bg-gray-700 p-4">
              <div className="text-sm text-gray-400">Destino</div>
              <div className="font-medium text-lg text-gray-100">{flight.destino}</div>
              <div className="text-sm text-gray-400">
                Aterrizaje: {formatTime(flight.aterrizajeLocal)} Local
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-600 rounded-2xl bg-gray-700 p-4">
              <div className="text-sm text-gray-400">Fecha</div>
              <div className="font-medium text-lg text-gray-100">{formatDate(flight.despegue)}</div>
            </div>
            <div className="border border-gray-600 rounded-2xl bg-gray-700 p-4">
              <div className="text-sm text-gray-400">Capacidad</div>
              <div className="font-medium text-lg text-gray-100">{flight.capacidadAvion} pasajeros</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer transition"
            >
              Volver
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
