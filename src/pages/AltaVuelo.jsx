import { useMemo, useState } from "react";
import Field from "../components/Field";
import Select from "react-select";
import { CirclePlus, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIRPORTS, AIRLINES, AVIONES } from "../constants/airports";
import { api } from "../services/api";
import { v4 as uuidv4 } from "uuid";

export const AltaVuelo = () => {
  const navigate = useNavigate();

  const airportOptions = useMemo(
    () => AIRPORTS.map(a => ({ value: a.code, label: `${a.city} (${a.code}) - ${a.name}` })),
    []
  );
  const avionesOptions = useMemo(
    () => AVIONES.map(v => ({ value: v.code, label: `${v.code} (${v.pasajeros} pasajeros)` })),
    []
  );

  // fecha/hora mínima (no permitir pasado en el input)
  const nowLocalISO = useMemo(() => {
    const now = new Date();
    const tzFix = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return tzFix.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
  }, []);

  // ISO sin milisegundos
  const toIsoNoMs = (d) => new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");

  const [form, setForm] = useState({
    aerolinea: "",
    // ✅ eliminado: fecha
    origen: "",
    destino: "",
    precio: "",
    horaDespegueUtc: "",
    horaAterrizajeLocal: "",
    estadoVuelo: "EN_HORA",
    capacidadAvion: 0,
    tipoAvion: "",
  });

  const [msg, setMsg] = useState({ type: "", text: "" });
  const setError = (t) => setMsg({ type: "error", text: t });
  const setOk = (t) => setMsg({ type: "ok", text: t });

  // destino dinámico (excluye origen)
  const destinoOptions = useMemo(() => {
    if (!form.origen) return airportOptions;
    return airportOptions.filter(o => o.value !== form.origen);
  }, [airportOptions, form.origen]);

  const selectStyles = {
    control: (b) => ({ ...b, backgroundColor: "#374151", borderColor: "#4B5563", color: "#F3F4F6", minHeight: "44px", borderRadius: "12px", "&:hover": { borderColor: "#6B7280" } }),
    menu:    (b) => ({ ...b, backgroundColor: "#374151", border: "1px solid #4B5563", borderRadius: "12px", zIndex: 30 }),
    option:  (b, s) => ({ ...b, backgroundColor: s.isFocused ? "#4B5563" : "#374151", color: "#F3F4F6", "&:hover": { backgroundColor: "#4B5563" } }),
    singleValue: (b) => ({ ...b, color: "#F3F4F6" }),
    placeholder:(b) => ({ ...b, color: "#9CA3AF" }),
  };

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // requeridos (sin fecha)
    if (
      !form.aerolinea ||
      !form.origen ||
      !form.destino ||
      form.precio === "" ||
      !form.horaDespegueUtc ||
      !form.horaAterrizajeLocal ||
      !form.tipoAvion ||
      !form.capacidadAvion
    ) {
      return setError("Completá todos los campos.");
    }

    // numéricos
    const precioNumber = Number(form.precio);
    const capacidadNumber = Number(form.capacidadAvion || 0);
    if (Number.isNaN(precioNumber) || precioNumber < 50) return setError("El precio debe ser un número válido (mínimo 50).");
    if (!Number.isFinite(capacidadNumber) || capacidadNumber <= 0) return setError("Capacidad de avión inválida.");

    if (form.origen === form.destino) return setError("El origen y el destino deben ser distintos.");

    // fechas/reglas
    const despegueLocal = new Date(form.horaDespegueUtc);
    const aterrizajeLocal = new Date(form.horaAterrizajeLocal);
    const ahora = new Date();
    if (despegueLocal < ahora) return setError("La hora de despegue no puede ser anterior a ahora.");
    if (aterrizajeLocal <= despegueLocal) return setError("La hora de aterrizaje debe ser mayor a la de despegue.");

    const idVuelo = uuidv4().slice(0, 8);

    // ✅ derivamos 'fecha' (YYYY-MM-DD) desde la hora de despegue
    const fechaStr = toIsoNoMs(despegueLocal).slice(0, 10);

    const dataVuelo = {
      idVuelo,
      aerolinea: form.aerolinea,
      fecha: fechaStr, // 👉 se envía al backend aunque no haya campo visible
      origen: form.origen,
      destino: form.destino,
      estadoVuelo: form.estadoVuelo,
      precio: precioNumber,
      horaDespegueUtc: toIsoNoMs(despegueLocal),
      horaAterrizajeLocal: toIsoNoMs(aterrizajeLocal),
      tipoAvion: form.tipoAvion,
      capacidadAvion: capacidadNumber,
    };

    try {
      console.log("createFlight payload:", dataVuelo);
      await api.createFlight(dataVuelo);
      setOk("¡Vuelo creado con éxito! Te llevamos al inicio…");
      setTimeout(() => {
        navigate("/", {
          state: {
            refresh: true,
            newFlightHint: { idVuelo, fecha: fechaStr, origen: form.origen, destino: form.destino },
          },
        });
      }, 1600);
    } catch (error) {
      console.error(error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string" ? error.response.data : null) ||
        error?.message || "desconocido";
      setError(`Ha ocurrido un error: ${serverMsg}`);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <main className="max-w-md md:max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white transition font-medium"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <CirclePlus className="inline-block" /> Nuevo Vuelo
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-gray-700 rounded-2xl p-6 bg-gray-800 shadow-2xl">
          <Field label="Aerolínea">
            <select
              value={form.aerolinea}
              onChange={(e) => setForm((f) => ({ ...f, aerolinea: e.target.value }))}
              className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="" className="bg-gray-700 text-gray-100">Seleccionar aerolínea</option>
              {AIRLINES.map((a) => <option key={a} className="bg-gray-700 text-gray-100">{a}</option>)}
            </select>
          </Field>

          {/* ✅ Eliminado: Field "Fecha de despegue" */}

          <Field label="Estado">
            <select
              value={form.estadoVuelo}
              onChange={(e) => setForm((f) => ({ ...f, estadoVuelo: e.target.value }))}
              className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              {["EN_HORA", "CONFIRMADO", "DEMORADO", "CANCELADO"].map((a) => (
                <option key={a} className="bg-gray-700 text-gray-100">{a}</option>
              ))}
            </select>
          </Field>

          <Field label="Origen">
            <Select
              value={form.origen ? airportOptions.find(o => o.value === form.origen) : null}
              onChange={(e) => setForm((f) => ({ ...f, origen: e.value, destino: f.destino === e.value ? "" : f.destino }))}
              options={airportOptions}
              placeholder="Escribe para buscar o selecciona una opción..."
              styles={selectStyles}
            />
          </Field>

          <Field label="Destino">
            <Select
              isDisabled={!form.origen}
              value={form.destino ? destinoOptions.find(o => o.value === form.destino) : null}
              onChange={(e) => setForm((f) => ({ ...f, destino: e.value }))}
              options={destinoOptions}
              placeholder={form.origen ? "Escribe para buscar o selecciona una opción..." : "Elegí el origen primero"}
              styles={selectStyles}
            />
          </Field>

          <Field label="Precio">
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
              placeholder="Mínimo 50"
              min={50}
              className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </Field>

          <Field label="Hora de despegue (UTC)">
            <input
              type="datetime-local"
              step={1}
              min={nowLocalISO}
              value={form.horaDespegueUtc}
              onChange={(e) => setForm((f) => ({ ...f, horaDespegueUtc: e.target.value }))}
              className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </Field>

          <Field label="Hora de aterrizaje (Local)">
            <input
              type="datetime-local"
              step={1}
              min={form.horaDespegueUtc || nowLocalISO}
              value={form.horaAterrizajeLocal}
              onChange={(e) => setForm((f) => ({ ...f, horaAterrizajeLocal: e.target.value }))}
              className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </Field>

          <Field label="Tipo de avión">
            <Select
              value={form.tipoAvion ? avionesOptions.find(o => o.value === form.tipoAvion) : null}
              onChange={(e) => {
                const avion = AVIONES.find(a => a.code === e.value);
                const pasajeros = avion ? avion.pasajeros : 0;
                setForm((f) => ({ ...f, tipoAvion: e.value, capacidadAvion: pasajeros }));
              }}
              options={avionesOptions}
              placeholder="Escribe para buscar o selecciona una opción..."
              styles={selectStyles}
            />
          </Field>

          <button type="submit" className="w-full h-11 rounded-xl bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition font-medium">
            Confirmar
          </button>

          {msg.text && (
            <div className={msg.type === "ok" ? "alert alert-ok mt-2" : "alert alert-error mt-2"}>
              {msg.type === "ok" ? <CheckCircle2 className="mr-2" /> : <AlertTriangle className="mr-2" />}
              <span>{msg.text}</span>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};


