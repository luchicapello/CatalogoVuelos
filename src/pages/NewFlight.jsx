import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../API/api.js'

const initial = { id_vuelo:'', aerolinea:'', fecha:'', origen:'', destino:'', precio:'', hora_despegue:'', hora_aterrizaje_local:'', estado_vuelo:'CONFIRMADO', disponibilidad:[] }

export default function NewFlight () {
  const [form, setForm] = useState(initial)
  const [err, setErr] = useState('')
  const nav = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    try {
      setErr('')
      const payload = { ...form, precio: parseFloat(form.precio) }
      const created = await api.post('/vuelos', payload)
      nav(`/vuelos/${created.id}`)
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="container">
      <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '.8rem' }}>
        <h2>Alta de vuelo</h2>
        <div className="grid" style={{ gridTemplateColumns:'repeat(2,1fr)', gap:'.7rem' }}>
          <input className="input" name="id_vuelo" placeholder="N° de vuelo" onChange={handle} required />
          <input className="input" name="aerolinea" placeholder="Aerolínea" onChange={handle} required />
          <input className="input" name="fecha" type="date" onChange={handle} required />
          <input className="input" name="origen" placeholder="Origen" onChange={handle} required />
          <input className="input" name="destino" placeholder="Destino" onChange={handle} required />
          <input className="input" name="precio" type="number" step="0.01" placeholder="Precio" onChange={handle} required />
          <input className="input" name="hora_despegue" type="datetime-local" onChange={handle} required />
          <input className="input" name="hora_aterrizaje_local" type="datetime-local" onChange={handle} required />
          <select name="estado_vuelo" value={form.estado_vuelo} onChange={handle}>
            <option>CONFIRMADO</option>
            <option>DEMORADO</option>
            <option>CANCELADO</option>
            <option>EN_VUELO</option>
            <option>ATERRIZA</option>
          </select>
        </div>
        {err && <div className="badge bad">{err}</div>}
        <div style={{ display:'flex', gap:'.5rem' }}>
          <button className="btn" type="submit">Crear</button>
        </div>
      </form>
    </div>
  )
}