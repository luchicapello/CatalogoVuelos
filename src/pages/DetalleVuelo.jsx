import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pill from "../components/Pill";
import { useState } from "react";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { ModalFormDemorado } from "../components/ModalFormDemorado";
import { ModalConfirmarEstado } from "../components/ModalConfirmarEstado";

export default function DetalleVuelo() {
  const navigate = useNavigate();
  const location = useLocation();
  const flight = location.state?.flight;
  //console.log(flight);


  const [flightStatus, setFlightStatus] = useState(flight.estadoVuelo);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, loading, user } = useSelector(state => state.auth)
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);


  const handleModalSuccess = (updatedFlight) => {
    // Update local state with the updated flight data from the modal
    setFlightStatus(updatedFlight.estadoVuelo);
    // Mutate the flight object in location state (or better, update a local state copy of flight if we had one, 
    // but here we are relying on the 'flight' variable from location.state which is mutable in this context 
    // or we should update the UI to reflect changes)
    // Ideally we should have a local state for flight, but for now let's update the refs we use.
    flight.estadoVuelo = updatedFlight.estadoVuelo;
    flight.despegue = updatedFlight.despegue;
    flight.aterrizajeLocal = updatedFlight.aterrizajeLocal;
    
    // Force re-render if needed (setFlightStatus does this for status, but times might need more)
    // Since we are using 'flight' directly in render, we might need to force update or use state.
    // Let's assume 'flight' is just a reference and we need to trigger a re-render.
    // setFlightStatus triggered a re-render.
  };


  const toggleModal = () => {
    setOpenModal((prevState) => {
      return !prevState;
    })
  }

  const toggleConfirmModal = () => {
    setOpenConfirmModal((prev) => !prev);
  }


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
    if (newStatus === 'DEMORADO') {
      toggleModal();
      return; // Stop here, modal handles the rest
    }
    setPendingStatus(newStatus);
    toggleConfirmModal();
  }

  // Confirmar cambio de estado
  const confirmSaveStatus = async () => {
    setIsLoading(true);
    const newStatus = pendingStatus;
    const flightId = flight.id
    try {
      // Confirmación especial para cancelar vuelos (handled by modal text now)
      // if (newStatus === 'CANCELADO') { ... }

      console.log(`Cambiando vuelo ${flightId} a estado: ${newStatus}`);



      // verificar si el estado cambio a DEMORADO, entonces, cambiar el horario..
      // if (newStatus === 'DEMORADO') {
      //   Logic moved to ModalFormDemorado
      // }

      // Llamada a la API para actualizar el estado
      await api.changeFlightStatus(flightId, newStatus);
      //console.log('response final ' , responseStatus);

      // Actualizar el estado del vuelo original y ocultar el botón
      flight.estadoVuelo = newStatus;
      setFlightStatus(newStatus); // Update local state to reflect change in UI if needed
      toggleConfirmModal();
      setIsLoading(false);
      console.log(`Estado del vuelo ${flightId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error al cambiar estado del vuelo:', error);
      // Aquí podrías mostrar un toast o mensaje de error al usuario
      alert('Error al cambiar el estado del vuelo. Por favor, intenta de nuevo.');
      setIsLoading(false);
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
              onClick={() => navigate('/home')}
              className="px-4 h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer transition"
            >
              Volver
            </button>
          </div>
        </main>
      </>
    );
  }

  const isFlightInPast = new Date() > new Date(flight.aterrizajeLocal);

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
            {
              (!loading && isAuthenticated && user.rol == 'admin')

                ?
                flight.estadoVuelo !== 'CANCELADO' ? (
                  <select
                    disabled={isFlightInPast}
                    value={flightStatus}
                    onChange={(e) => changeFlightStatus(e.target.value)}
                    className={`inline-flex items-center justify-center rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium whitespace-nowrap min-w-[80px] outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFlightInPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    style={{
                      backgroundColor: flight.estadoVuelo === 'EN_HORA' ? '#065f46' :
                        flight.estadoVuelo === 'DEMORADO' ? '#92400e' : '#374151',
                      borderColor: flight.estadoVuelo === 'EN_HORA' ? '#10b981' :
                        flight.estadoVuelo === 'DEMORADO' ? '#f59e0b' : '#6b7280',
                      color: flight.estadoVuelo === 'EN_HORA' ? '#6ee7b7' :
                        flight.estadoVuelo === 'DEMORADO' ? '#fbbf24' : '#d1d5db'
                    }}
                  >
                    {flight.estadoVuelo !== 'DEMORADO' && <option value="EN_HORA">En Hora</option>}
                    <option value="DEMORADO">Demorado</option>
                    <option value="CANCELADO" style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancelado</option>
                  </select>
                ) : (
                  <Pill variant={getStatusVariant(flight.estadoVuelo)}>
                    {formatFlightStatus(flight.estadoVuelo)}
                  </Pill>
                )


                :
                <Pill variant={getStatusVariant(flight.estadoVuelo)}>
                  {formatFlightStatus(flight.estadoVuelo)}
                </Pill>

            }


            {/* Removed inline save button */}

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
                Aterrizaje: {formatTime(flight.aterrizajeLocal)} UTC
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
              onClick={() => navigate('/home')}
              className="px-4 h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer transition"
            >
              Volver
            </button>
          </div>
        </section>

        <ModalFormDemorado 
          isOpen={openModal} 
          toggleModal={toggleModal} 
          flight={flight}
          onSuccess={handleModalSuccess} 
        />

        <ModalConfirmarEstado
          isOpen={openConfirmModal}
          toggleModal={toggleConfirmModal}
          newStatus={pendingStatus}
          onConfirm={confirmSaveStatus}
          isLoading={isLoading}
        />
      </main>
    </>
  );
}
