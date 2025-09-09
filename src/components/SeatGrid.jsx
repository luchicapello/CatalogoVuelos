export default function SeatGrid ({ disponibilidad = [] }) {
  if (!Array.isArray(disponibilidad)) return null
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
      {disponibilidad.map(s => (
        <div key={s} className="badge" style={{ textAlign: 'center' }}>{s}</div>
      ))}
    </div>
  )
}