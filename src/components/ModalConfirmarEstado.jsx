import { Loader2, AlertTriangle, CheckCircle2, X } from "lucide-react";

export const ModalConfirmarEstado = ({
  isOpen,
  toggleModal,
  newStatus,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null;

  const formatStatus = (status) => {
    const statusMap = {
      EN_HORA: "En Hora",
      CONFIRMADO: "Confirmado",
      DEMORADO: "Demorado",
      CANCELADO: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CANCELADO":
        return "text-red-400";
      case "CONFIRMADO":
        return "text-blue-400";
      case "EN_HORA":
        return "text-green-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="size-5 text-yellow-500" />
            Confirmar Cambio
          </h3>
          <button
            onClick={toggleModal}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que quieres cambiar el estado del vuelo a{" "}
            <span className={`font-bold ${getStatusColor(newStatus)}`}>
              {formatStatus(newStatus)}
            </span>
            ?
          </p>
          
          {newStatus === 'CANCELADO' && (
             <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                Esta acción es irreversible y notificará a los pasajeros.
             </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={toggleModal}
              className="flex-1 h-11 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
