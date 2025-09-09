import { useEffect, useState } from 'react'
import { api, sseConnect } from '../API/api.js'
import SearchBar from '../components/SearchBar.jsx'
import FlightCard from '../components/FlightCard.jsx'

export default function Flights() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFlights = async (filters) => {
    try {
      setLoading(true)
      setError('')
      const clean = (filters && Object.keys(filters).length) ? filters : undefined
      const data = await api.get('/vuelos', clean)
      setFlights(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Error al cargar vuelos')
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
    const close = sseConnect((evt) => {
      if (['vuelo_creado', 'vuelo_modificado', 'vuelo_estado'].includes(evt?.type)) {
        fetchFlights()
      }
    })
    return close
  }, [])

  return (
    <div className="container">
      <h2>Vuelos</h2>
      <SearchBar onSearch={fetchFlights} />
      {error && <div className="badge bad">{error}</div>}
      {loading ? <p>Cargando…</p> : (
        <div className="grid cards">
          {flights.map(f => <FlightCard key={f.id} f={f} />)}
        </div>
      )}
    </div>
  )
}
