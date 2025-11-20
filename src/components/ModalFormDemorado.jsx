import { useState } from "react";
import { X, Clock, AlertTriangle, Loader2, Save } from "lucide-react";
import { api } from "../services/api";

export const ModalFormDemorado = ({ isOpen, toggleModal, flight, onSuccess }) => {
  const [delayHours, setDelayHours] = useState(0);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitForm(e) {
    e.preventDefault();
    setError(null);
    
    if (delayHours === 0 && delayMinutes === 0) {
        setError("Por favor, ingresá un tiempo de demora mayor a 0.");
        return;
    }

    setIsLoading(true);

    try {
      // 1. Calculate new times
      const hoursToAdd = Number(delayHours);
      const minutesToAdd = Number(delayMinutes);

      const fechaAterrizajeOriginal = new Date(flight.aterrizajeLocal);
      fechaAterrizajeOriginal.setUTCHours(
        fechaAterrizajeOriginal.getUTCHours() + hoursToAdd
      );
      fechaAterrizajeOriginal.setUTCMinutes(
        fechaAterrizajeOriginal.getUTCMinutes() + minutesToAdd
      );
      const fechaAterrizajeFinalISO = fechaAterrizajeOriginal.toISOString();

      const fechaDespegueOriginal = new Date(flight.despegue);
      fechaDespegueOriginal.setUTCHours(
        fechaDespegueOriginal.getUTCHours() + hoursToAdd
      );
      fechaDespegueOriginal.setUTCMinutes(
        fechaDespegueOriginal.getUTCMinutes() + minutesToAdd
      );
      const fechaDespegueFinalISO = fechaDespegueOriginal.toISOString();

      // 2. Call API to change date
      await api.changeFlightDate(
        flight.id,
        fechaAterrizajeFinalISO,
        fechaDespegueFinalISO
      );

      // 3. Call API to change status
      await api.changeFlightStatus(flight.id, "DEMORADO");

      // 4. Success
      onSuccess({
        ...flight,
        estadoVuelo: "DEMORADO",
        despegue: fechaDespegueFinalISO,
        aterrizajeLocal: fechaAterrizajeFinalISO,
      });
      toggleModal();
      setDelayHours(0);
      setDelayMinutes(0);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar la demora. Intentalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="size-5 text-yellow-500" />
            Reportar Demora
          </h3>
          <button
            onClick={toggleModal}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="delayHours"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Horas
                </label>
                <input
                  type="number"
                  id="delayHours"
                  min="0"
                  value={delayHours}
                  onChange={(e) => setDelayHours(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-600 bg-gray-700 text-white px-3 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="delayMinutes"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Minutos
                </label>
                <input
                  type="number"
                  id="delayMinutes"
                  min="0"
                  max="59"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-600 bg-gray-700 text-white px-3 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Este tiempo se sumará a la hora de despegue y aterrizaje actual (UTC).
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-900/20 border border-red-800 text-red-200 text-sm flex items-start gap-2">
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={toggleModal}
                className="flex-1 h-11 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl bg-yellow-600 text-white hover:bg-yellow-500 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Confirmar Demora
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
