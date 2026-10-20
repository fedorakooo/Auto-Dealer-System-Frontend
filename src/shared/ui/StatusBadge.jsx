import { Badge } from '@/shared/ui/Badge.jsx'
import { getStatusMeta } from '@/constants/statuses.js'

export function StatusBadge({ status }) {
  const [tone, label] = getStatusMeta(status)
  return <Badge tone={tone}>{label}</Badge>
}
