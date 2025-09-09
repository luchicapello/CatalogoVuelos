import { estadoBadgeKind } from '../utils/utils.js'
export default function StatusBadge ({ estado }) {
  const kind = estadoBadgeKind(estado)
  return <span className={`badge ${kind}`}>{estado?.replace('_', ' ')}</span>
}