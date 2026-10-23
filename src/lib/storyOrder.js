// Editorial priority shared by Events, Community, company filters and heroes.
// Recognition and public visibility lead; everyday team moments close the gallery.
const impactOrder = [
  'community--hamilton--partner-meeting-dubai-2025',
  'punjab-cm-equipment-visit',
  'community--hamilton--aaj-tak-coverage',
  'community--hamilton--founder-leadership',
  'hamilton-c6-pgi-installation',
  'community--hamilton--homi-bhabha-sangrur-c3',
  'community--hamilton--aiims-mohali-c6',
  'community--hamilton--gmch-patiala-paediatrics',
  'community--medelec--pilbs-mohali-ot-light',
  'community--karl-storz--gmch-patiala-intubation',
  'hamilton-c6-clinical-training',
  'community--hamilton--gmch-patiala-application',
  'community--hamilton--homi-bhabha-new-chandigarh-c3',
  'community--hamilton--homi-bhabha-clinical-session',
  'community--kiran--founder-ultisys',
  'community--hamilton--exhibition-booth-outdoor',
  'community--hamilton--exhibition-booth-indoor',
  'community--medelec--booth-team-meeting',
  'community--medelec--our-team',
  'community--medelec--equipment-dispatch',
  'community--medelec--team-pool',
]

const priorities = new Map(impactOrder.map((id, index) => [id, index]))
// Place future admin uploads beside related work, using recency only within a tier.
const categoryPriority = { Visit: 3.5, Installation: 9.5, Training: 13.5, Workshop: 13.5, Conference: 17.5, Community: 19.5 }

export function compareStoriesByImpact(a, b) {
  const priority = (event) => priorities.get(event.id) ?? categoryPriority[event.category] ?? 19.5
  return priority(a) - priority(b)
    || (Number(b.created_at) || 0) - (Number(a.created_at) || 0)
    || String(b.event_date || '').localeCompare(String(a.event_date || ''))
    || String(a.title || '').localeCompare(String(b.title || ''))
}
