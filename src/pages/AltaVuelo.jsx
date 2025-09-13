import { useState } from "react";
import Field from "../components/Field";
import Select from "react-select";
import { CirclePlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIRPORTS, AIRLINES } from "../constants/airports";


export const AltaVuelo = () => {
    const navigate = useNavigate();
    
    // Convert AIRPORTS to react-select format
    const airportOptions = AIRPORTS.map(airport => ({
        value: airport.code,
        label: `${airport.city} (${airport.code}) - ${airport.name}`
    }));
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
        if (!form.aerolinea || !form.fecha_despegue || !form.origen || !form.destino || !form.precio || !form.despegue || !form.aterrizaje || !form.terms) {
            setMsg("Completá todos los campos y aceptá los términos.");
            return;
        }
        setMsg("Cuenta creada (demo)");
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <main className="max-w-md md:max-w-xl mx-auto px-4 py-10">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white transition font-medium"
                    >
                        <ArrowLeft className="size-4" />
                        Volver
                    </button>
                    <h1 className="text-2xl font-semibold flex items-center gap-2 text-white">
                        <CirclePlus className="inline-block" /> Nuevo Vuelo
                    </h1>
                </div>
            <form
                onSubmit={submit}
                className="space-y-4 border border-gray-700 rounded-2xl p-6 bg-gray-800 shadow-2xl"
            >
                <Field label="Aerolínea">
                    <select
                        value={form.aerolinea}
                        onChange={(e) => setForm((f) => ({ ...f, aerolinea: e.target.value }))}
                        className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    >
                        <option value="" className="bg-gray-700 text-gray-100">Seleccionar aerolínea</option>
                        {AIRLINES.map((a) => (
                            <option key={a} className="bg-gray-700 text-gray-100">{a}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Fecha de despegue">
                    <input
                        type="date"
                        value={form.fecha_despegue}
                        onChange={(e) => setForm((f) => ({ ...f, fecha_despegue: e.target.value }))}
                        className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                </Field>
                <Field label="Origen">
                    <Select
                        value={form.origen}
                        onChange={(e) => setForm((f) => ({ ...f, origen: e.target.value }))}
                        options={airportOptions}
                        placeholder="Escribe para buscar o selecciona una opción..."
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: '#374151',
                                borderColor: '#4B5563',
                                color: '#F3F4F6',
                                minHeight: '44px',
                                borderRadius: '12px',
                                '&:hover': {
                                    borderColor: '#6B7280'
                                }
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: '#374151',
                                border: '1px solid #4B5563',
                                borderRadius: '12px'
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                                color: '#F3F4F6',
                                '&:hover': {
                                    backgroundColor: '#4B5563'
                                }
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: '#F3F4F6'
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: '#9CA3AF'
                            })
                        }}
                    />
                </Field>
                <Field label="Destino">
                    <Select
                        value={form.destino}
                        onChange={(e) => setForm((f) => ({ ...f, destino: e.target.value }))}
                        options={airportOptions}
                        placeholder="Escribe para buscar o selecciona una opción..."
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: '#374151',
                                borderColor: '#4B5563',
                                color: '#F3F4F6',
                                minHeight: '44px',
                                borderRadius: '12px',
                                '&:hover': {
                                    borderColor: '#6B7280'
                                }
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: '#374151',
                                border: '1px solid #4B5563',
                                borderRadius: '12px'
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                                color: '#F3F4F6',
                                '&:hover': {
                                    backgroundColor: '#4B5563'
                                }
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: '#F3F4F6'
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: '#9CA3AF'
                            })
                        }}
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
                        className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                        className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                </Field>
                <Field label="Hora de aterrizaje">
                    <input
                        type="time"
                        step={1}
                        value={form.aterrizaje}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, aterrizaje: e.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                </Field>

                <label className="flex items-center gap-3 text-sm text-gray-200">
                    <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, terms: e.target.checked }))
                        }
                        className="text-gray-600 focus:ring-gray-500"
                    />
                    Acepto los términos y condiciones
                </label>
                <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition font-medium"
                >
                    Confirmar
                </button>
                {msg && <p className="text-sm text-center text-gray-300">{msg}</p>}
            </form>
            </main>
        </div>
    )
}
