import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pill from "../components/Pill";
import { useState } from "react";
import { api } from "../services/api";

export default function DetalleVuelo() {
  const navigate = useNavigate();
  const location = useLocation();
  const flight = location.state?.flight;
  const [showBtnSave, setShowBtnSave] = useState(false)
  const [flightStatus, setFlightStatus] = useState(flight.estadoVuelo);
  const [isLoading, setIsLoading] = useState(false);
  console.log(flight);


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

  // Verificar si cambio el estado del vuelo
  const changeFlightStatus = (newStatus) => {
    setShowBtnSave(true);
    setFlightStatus(newStatus);
  }

  // Confirmar cambio de estado
  const confirmSaveStatus = async () => {
    setIsLoading(true);
    const newStatus = flightStatus;
    const flightId = flight.id
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
      const response = await api.changeFlightStatus(flightId, newStatus);
      console.log(response);
      setIsLoading(false)
      console.log(`Estado del vuelo ${flightId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error al cambiar estado del vuelo:', error);
      // Aquí podrías mostrar un toast o mensaje de error al usuario
      alert('Error al cambiar el estado del vuelo. Por favor, intenta de nuevo.');
      setIsLoading(false)
    }
  }
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
            {/*
            <Pill variant={getStatusVariant(flight.estadoVuelo)}>
              {formatFlightStatus(flight.estadoVuelo)}
            </Pill>
            */
            }
            {flight.estadoVuelo !== 'CANCELADO' ? (
              <select
                value={flightStatus}
                onChange={(e) => changeFlightStatus(e.target.value)}
                className="inline-flex items-center justify-center rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium whitespace-nowrap min-w-[80px] cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: flight.estadoVuelo === 'EN_HORA' ? '#065f46' :
                    flight.estadoVuelo === 'DEMORADO' ? '#92400e' : '#374151',
                  borderColor: flight.estadoVuelo === 'EN_HORA' ? '#10b981' :
                    flight.estadoVuelo === 'DEMORADO' ? '#f59e0b' : '#6b7280',
                  color: flight.estadoVuelo === 'EN_HORA' ? '#6ee7b7' :
                    flight.estadoVuelo === 'DEMORADO' ? '#fbbf24' : '#d1d5db'
                }}
              >
                <option value="EN_HORA">En Hora</option>
                <option value="DEMORADO">Demorado</option>
                <option value="CANCELADO" style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancelado</option>
              </select>
            ) : (
              <Pill variant={getStatusVariant(flight.estadoVuelo)}>
                {formatFlightStatus(flight.estadoVuelo)}
              </Pill>
            )}

            {
              showBtnSave &&
              <Pill><button onClick={(e) => confirmSaveStatus()} className="hover:opacity-70 hover:cursor-pointer"> {isLoading ? 'Cargando' : 'Guardar'}</button></Pill>
            }

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
