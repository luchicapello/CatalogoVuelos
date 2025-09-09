import { useState } from 'react'

export default function SearchBar({ onSearch, initial = {} }) {
  const empty = { numero:'', fecha:'', origen:'', destino:'', aerolinea:'', estado:'' }
  const [q, setQ] = useState({ ...empty, ...initial })

  const handle = (e) => setQ(p => ({ ...p, [e.target.name]: e.target.value }))
  const submit = (e) => { e.preventDefault(); onSearch(q) }

  return (
    <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '.7rem' }}>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '.6rem' }}>
        <input className="input" name="numero" placeholder="N° vuelo" value={q.numero || ''} onChange={handle} />
        <input className="input" name="fecha" type="date" value={q.fecha || ''} onChange={handle} />
        <input className="input" name="origen" placeholder="Origen" value={q.origen || ''} onChange={handle} />
        <input className="input" name="destino" placeholder="Destino" value={q.destino || ''} onChange={handle} />
        <input className="input" name="aerolinea" placeholder="Aerolínea" value={q.aerolinea || ''} onChange={handle} />
        <select name="estado" value={q.estado || ''} onChange={handle}>
          <option value="">Estado</option>
          <option>CONFIRMADO</option>
          <option>DEMORADO</option>
          <option>CANCELADO</option>
          <option>EN_VUELO</option>
          <option>ATERRIZA</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button className="btn" type="submit">Buscar</button>
        <button className="btn ghost" type="button" onClick={() => { setQ(empty); onSearch({}) }}>
          Limpiar
        </button>
      </div>
    </form>
  )
}
