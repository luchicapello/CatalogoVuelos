import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import { currency, fmtDate, fmtTime } from '../utils/utils.js'

export default function FlightCard ({ f }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div><strong>{f.id_vuelo}</strong> · {f.aerolinea}</div>
          <div className="small">{f.origen} → {f.destino} · {fmtDate(f.fecha)} {fmtTime(f.hora_despegue)}</div>
        </div>
        <StatusBadge estado={f.estado_vuelo} />
      </div>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="small">Precio {currency(f.precio)}</div>
        <Link className="btn" to={`/vuelos/${f.id}`}>Ver detalle</Link>
      </div>
    </div>
  )
}