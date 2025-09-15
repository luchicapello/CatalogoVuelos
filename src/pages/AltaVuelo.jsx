import { useState } from "react";
import Field from "../components/Field";
import Select from "react-select";
import { CirclePlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIRPORTS, AIRLINES, AVIONES } from "../constants/airports";
import { api } from "../services/api";
import { v4 as uuidv4 } from 'uuid';



export const AltaVuelo = () => {
    const navigate = useNavigate();

    // Convert AIRPORTS to react-select format
    const airportOptions = AIRPORTS.map(airport => ({
        value: airport.code,
        label: `${airport.city} (${airport.code}) - ${airport.name}`
    }));
    // Convert AVIONES to react-select format
    const avionesOptions = AVIONES.map(avion => ({
        value: avion.code,
        label: `${avion.code} (${avion.pasajeros} pasajeros)`
    }));
    const [form, setForm] = useState({
        aerolinea: "",
        fecha: "",
        origen: "prueba",
        destino: "",
        precio: 50,
        horaDespegueUtc: "",
        horaAterrizajeLocal: "",
        estadoVuelo: "EN_HORA",
        capacidadAvion: 0,
        tipoAvion: ""
    });
    const [msg, setMsg] = useState("");

    async function submit(e) {
        e.preventDefault();
        if (!form.aerolinea || !form.fecha || !form.estadoVuelo || !form.origen || !form.destino || !form.precio || !form.horaDespegueUtc || !form.horaAterrizajeLocal || !form.capacidadAvion || !form.tipoAvion) {
            console.log(form);
            setMsg("Error: Completá todos los campos.");
            return;
        }
        if (form.origen === form.destino) {
            setMsg("Error: El origen y destino del vuelvo deben ser distintos.");
            return;
        }

        const fechaAterrizaje = new Date(form.horaAterrizajeLocal)
        const fechaDespegue = new Date(form.horaDespegueUtc)
        if (fechaAterrizaje < fechaDespegue) {
            setMsg("Error: la fecha/hora de aterrizaje no puede ser anterior a la de despegue.");
            return;
        }

        const idVuelo = uuidv4().slice(0, 8);
        const dataVuelo = { ...form, horaAterrizajeLocal: fechaAterrizaje.toISOString(), idVuelo, horaDespegueUtc: fechaDespegue.toISOString(), idVuelo }

        try {
            await api.createFlight(dataVuelo);
            setMsg("Vuelo creado con éxito");
        } catch (error) {
            console.log(error);
            setMsg(`Ha ocurrido un error ${error.message}`);
        }

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
                            value={form.fecha}
                            onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </Field>
                    <Field label="Estado">
                        <select
                            value={form.estadoVuelo}
                            onChange={(e) => setForm((f) => ({ ...f, estadoVuelo: e.target.value }))}
                            className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        >
                            <option value="" className="bg-gray-700 text-gray-100">Seleccionar estado</option>
                            {["EN_HORA", "CONFIRMADO", "DEMORADO", "CANCELADO"].map((a) => (
                                <option key={a} className="bg-gray-700 text-gray-100">{a}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Origen">
                        <Select
                            onChange={(e) => {
                                setForm((f) => ({ ...f, origen: e.value }))
                            }}
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
                            onChange={(e) => {
                                setForm((f) => ({ ...f, destino: e.value }))
                            }}
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
                                setForm((f) => ({ ...f, precio: parseFloat(e.target.value) }))
                            }
                            placeholder="Mínimo 50"
                            min={50}
                            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </Field>
                    <Field label="Hora de despegue UTC">
                        <input
                            type="datetime-local"
                            step={1}
                            value={form.horaDespegueUtc}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, horaDespegueUtc: e.target.value }))
                            }
                            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </Field>
                    <Field label="Hora de aterrizaje Local">
                        <input
                            type="datetime-local"
                            step={1}
                            value={form.horaAterrizajeLocal}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, horaAterrizajeLocal: e.target.value }))
                            }
                            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </Field>

                    <Field label="Tipo de avión">
                        <Select
                            onChange={(e) => {
                                console.log(e.value);
                                const pasajeros = AVIONES.find(a => a.code == e.value).pasajeros;
                                setForm((f) => ({ ...f, tipoAvion: e.value, capacidadAvion: pasajeros }))

                            }}
                            options={avionesOptions}
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
