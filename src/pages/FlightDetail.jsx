import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../API/api.js'
import StatusBadge from '../components/StatusBadge.jsx'
import SeatGrid from '../components/SeatGrid.jsx'
import { currency, fmtDate, fmtTime, ESTADOS } from '../utils/utils.js'

export default function FlightDetail () {
  const { id } = useParams()
  const [f, setF] = useState(null)
  const [saving, setSaving] = useState(false)
  const [estado, setEstado] = useState('')

  const load = async () => setF(await api.get(`/vuelos/${id}`))
  useEffect(() => { load() }, [id])
  useEffect(() => { if (f) setEstado(f.estado_vuelo) }, [f])

  const saveEstado = async () => {
    setSaving(true)
    await api.put(`/vuelos/${id}/estado`, { estado: estado })
    await load()
    setSaving(false)
  }

  if (!f) return <div className="container"><p>Cargando…</p></div>

  return (
    <div className="container">
      <div className="card" style={{ display: 'grid', gap: '.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Vuelo {f.id_vuelo} · {f.aerolinea}</h2>
          <StatusBadge estado={f.estado_vuelo} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div>
            <div><strong>Ruta:</strong> {f.origen} → {f.destino}</div>
            <div><strong>Fecha:</strong> {fmtDate(f.fecha)} {fmtTime(f.hora_despegue)} – Arribo {fmtTime(f.hora_aterrizaje_local)}</div>
            <div><strong>Precio:</strong> {currency(f.precio)}</div>
          </div>
          <div>
            <label className="small">Cambiar estado</label>
            <div style={{ display:'flex', gap:'.5rem' }}>
              <select value={estado} onChange={(e)=>setEstado(e.target.value)}>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <button className="btn" disabled={saving} onClick={saveEstado}>Guardar</button>
            </div>
          </div>
        </div>
        <div>
          <h3>Disponibilidad</h3>
          <SeatGrid disponibilidad={f.disponibilidad} />
        </div>
      </div>
    </div>
  )
}