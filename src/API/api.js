// src/API/api.js – con soporte MOCK (sin backend)
import flightsSeed from '../data/data.json'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1'
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
let TOKEN = null

// ------------------------
// MOCK DB en localStorage
// ------------------------
function getDB () {
  const raw = localStorage.getItem('db_flights')
  if (raw) return JSON.parse(raw)
  const db = { flights: JSON.parse(JSON.stringify(flightsSeed)) } // clonar seed
  localStorage.setItem('db_flights', JSON.stringify(db))
  return db
}
function setDB (db) { localStorage.setItem('db_flights', JSON.stringify(db)) }
function nextId (arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1 }
function emit (type, payload) { window.dispatchEvent(new CustomEvent('sse', { detail: { type, payload } })) }

// Helpers comunes
function headers (isJson = true) {
  const h = {}
  if (isJson) h['Content-Type'] = 'application/json'
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`
  return h
}
async function http (path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

// ------------------------
// API pública
// ------------------------
export const api = {
  setToken: (t) => { TOKEN = t },

  async get (path, params) {
    if (!USE_MOCK) {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return http(`${path}${qs}`, { headers: headers(false) })
    }
    // MOCK
    const db = getDB()
    if (path === '/vuelos') {
      let data = db.flights
      if (params) {
        const { numero, fecha, origen, destino, aerolinea, estado } = params
        if (numero) data = data.filter(v => (v.id_vuelo || '').toLowerCase().includes(String(numero).toLowerCase()))
        if (fecha) data = data.filter(v => String(v.fecha).startsWith(fecha))
        if (origen) data = data.filter(v => (v.origen || '').toLowerCase().includes(origen.toLowerCase()))
        if (destino) data = data.filter(v => (v.destino || '').toLowerCase().includes(destino.toLowerCase()))
        if (aerolinea) data = data.filter(v => (v.aerolinea || '').toLowerCase().includes(aerolinea.toLowerCase()))
        if (estado) data = data.filter(v => v.estado_vuelo === estado)
      }
      return data
    }
    const m = path.match(/^\/vuelos\/(\d+)$/)
    if (m) {
      const id = Number(m[1])
      const v = db.flights.find(f => f.id === id)
      if (!v) throw new Error('Vuelo no encontrado')
      return v
    }
    throw new Error(`GET mock no implementado para ${path}`)
  },

  async post (path, body) {
    if (!USE_MOCK) return http(path, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
    if (path === '/vuelos') {
      const db = getDB()
      const nuevo = { ...body, id: nextId(db.flights) }
      db.flights.push(nuevo)
      setDB(db)
      emit('vuelo_creado', nuevo)
      return nuevo
    }
    if (path === '/auth/login') {
      return { token: 'mock-token', username: body?.username || 'usuario' }
    }
    throw new Error(`POST mock no implementado para ${path}`)
  },

  async put (path, body) {
    if (!USE_MOCK) return http(path, { method: 'PUT', headers: headers(), body: JSON.stringify(body) })
    const m = path.match(/^\/vuelos\/(\d+)\/estado$/)
    if (m) {
      const id = Number(m[1])
      const db = getDB()
      const v = db.flights.find(f => f.id === id)
      if (!v) throw new Error('Vuelo no encontrado')
      v.estado_vuelo = body?.estado || v.estado_vuelo
      setDB(db)
      emit('vuelo_estado', { id, estado: v.estado_vuelo })
      return v
    }
    throw new Error(`PUT mock no implementado para ${path}`)
  },

  async del (path) {
    if (!USE_MOCK) return http(path, { method: 'DELETE', headers: headers(false) })
    const m = path.match(/^\/vuelos\/(\d+)$/)
    if (m) {
      const id = Number(m[1])
      const db = getDB()
      db.flights = db.flights.filter(f => f.id !== id)
      setDB(db)
      emit('vuelo_modificado', { id, deleted: true })
      return { ok: true }
    }
    throw new Error(`DELETE mock no implementado para ${path}`)
  }
}

export function sseConnect (onMessage) {
  if (!USE_MOCK) {
    const es = new EventSource(`${BASE}/events`)
    es.onmessage = (e) => { try { onMessage(JSON.parse(e.data)) } catch {} }
    return () => es.close()
  }
  // MOCK SSE con eventos del navegador
  const handler = (e) => onMessage(e.detail)
  window.addEventListener('sse', handler)
  return () => window.removeEventListener('sse', handler)
}

