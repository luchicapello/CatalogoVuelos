import { useMemo, useState } from "react";
import Field from "../components/Field";
import { SAMPLE_FLIGHTS } from "../data/flights";
import Select from "react-select";
import { CirclePlus } from "lucide-react";


export const AltaVuelo = () => {

    const airlines = useMemo(
        () => Array.from(new Set(SAMPLE_FLIGHTS.map((f) => f.airline))),
        []
    );
    const AIRPORTS = [
        { value: "EZE", label: "Buenos Aires (EZE) - Ministro Pistarini" },
        { value: "AEP", label: "Buenos Aires (AEP) - Aeroparque" },
        { value: "SCL", label: "Santiago (SCL) - Arturo Merino Benítez" },
        { value: "GRU", label: "São Paulo (GRU) - Guarulhos" },
        { value: "MIA", label: "Miami (MIA) - International" }
    ];
    const [form, setForm] = useState({
        aerolinea: "",
        fecha_despegue: "",
        origen: "",
        destino: "",
        precio: 50,
        moneda: "usd",
        despegue: "",
        aterrizaje: "",
        estado: "En hora/confirmado",
        fila_bussiness: 1,
        porcentaje_bussiness: 0,
        fila_primera: 1,
        porcentaje_primera: 0,
        distribucion:1
    });
    const [msg, setMsg] = useState("");

    function submit(e) {
        e.preventDefault();
        if (!form.name || !form.email || form.password.length < 6 || !form.terms) {
            setMsg("Completá todos los campos y aceptá los términos.");
            return;
        }
        setMsg("Cuenta creada (demo)");
    }

    return (
        <main className="max-w-md md:max-w-xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2"><CirclePlus className="inline-block" /> Nuevo Vuelo</h1>
            <form
                onSubmit={submit}
                className="space-y-4 border rounded-2xl p-6 bg-white"
            >
                <Field label="Aerolínea">
                    <select
                        value={form.aerolinea}
                        onChange={(e) => setForm((f) => ({ ...f, aerolinea: e.target.value }))}
                        className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        <option value="">Todas</option>
                        {airlines.map((a) => (
                            <option key={a}>{a}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Fecha de despegue">
                    <input
                        type="date"
                        value={form.fecha_despegue}
                        onChange={(e) => setForm((f) => ({ ...f, fecha_despegue: e.target.value }))}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Origen">
                    <Select
                        value={form.origen}
                        onChange={(e) => setForm((f) => ({ ...f, origen: e.target.value }))}
                        options={AIRPORTS}
                        placeholder="Escribe para buscar o selecciona una opción..."
                    />
                </Field>
                <Field label="Destino">
                    <Select
                        value={form.destino}
                        onChange={(e) => setForm((f) => ({ ...f, destino: e.target.value }))}
                        options={AIRPORTS}
                        placeholder="Escribe para buscar o selecciona una opción..."
                    />
                </Field>
                <Field label="Precio">
                    <input
                        type="numeric"
                        value={form.precio}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, precio: e.target.value }))
                        }
                        placeholder="Mínimo 50"
                        min={50}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Hora de despegue">
                    <input
                        type="time"
                        step={1}
                        value={form.despegue}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, despegue: e.target.value }))
                        }
                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Hora de atrerrizaje">
                    <input
                        type="time"
                        step={1}
                        value={form.aterrizaje}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, despegue: e.target.value }))
                        }
                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Filas Bussiness">
                    <input
                        type="number"
                        value={form.fila_bussiness}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, fila_bussiness: e.target.value }))
                        }
                        placeholder="Cantidad de filas bussiness"
                        min={1}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Porcentaje de adicion al precio categoria Bussiness">
                    <input
                        type="number"
                        value={form.porcentaje_bussiness}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, porcentaje_bussiness: e.target.value }))
                        }
                        placeholder="Porcentaje de recargo bussiness"
                        min={0}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Filas Primera Clase">
                    <input
                        type="number"
                        value={form.fila_primera}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, fila_primera: e.target.value }))
                        }
                        placeholder="Cantidad de filas de primera clase"
                        min={1}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Porcentaje de adicion al precio categoria Primera">
                    <input
                        type="number"
                        value={form.porcentaje_primera}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, porcentaje_primera: e.target.value }))
                        }
                        placeholder="Porcentaje de recargo primera clase"
                        min={0}

                        className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </Field>
                <Field label="Distribución de asientos">
                    <select
                        value={form.distribucion}
                        onChange={(e) => setForm((f) => ({ ...f, distribucion: e.target.value }))}
                        className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
                    >

                        <option value={1}>6 asientos por fila (3 asientos, pasillo, 3 asientos)</option>
                        <option value={2}>7 asientos por fila (2 asientos, pasillo, 3 asientos, pasillo, 2 asientos) </option>
                        <option value={3}>10 asientos por fila (3 asientos, pasillo, 4 asientos, pasillo, 3 asientos)</option>

                    </select>
                </Field>

                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, terms: e.target.checked }))
                        }
                    />
                    Acepto los términos y condiciones
                </label>
                <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gray-900 text-white"
                >
                    Confirmar
                </button>
                {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
            </form>
        </main>
    )
}
