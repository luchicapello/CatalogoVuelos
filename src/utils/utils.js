export const currency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v ?? 0)
export const fmtDate = (d) => new Date(d).toLocaleDateString('es-AR')
export const fmtTime = (d) => new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
export const ESTADOS = ['CONFIRMADO', 'DEMORADO', 'CANCELADO', 'EN_VUELO', 'ATERRIZA']
export const estadoBadgeKind = (e) => e === 'CONFIRMADO' ? 'ok' : e === 'DEMORADO' ? 'warn' : e === 'CANCELADO' ? 'bad' : ''