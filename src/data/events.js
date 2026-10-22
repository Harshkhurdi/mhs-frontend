export const eventCategories = ['Visit', 'Installation', 'Training', 'Conference', 'Workshop', 'Community']

// Event dates were not supplied. Leave them blank rather than inventing a date.
const photo = (id, alt) => ({ id, src: `/images/events/${id}.webp`, thumbnail: `/images/events/${id}.webp`, alt })

export const defaultEvents = [
  {
    id: 'punjab-cm-equipment-visit',
    title: 'A closer look at better-equipped care.',
    category: 'Visit', location: 'Punjab', event_date: '',
    summary: 'Punjab Chief Minister Bhagwant Mann takes a personal look at newly installed medical equipment supplied by Medelec. An on-site demonstration brings the technology into focus — and the installation, expertise and service behind it.',
    photos: [
      photo('punjab-cm-equipment-visit', 'Punjab Chief Minister Bhagwant Mann views newly installed medical equipment during an on-site demonstration.'),
      photo('punjab-cm-equipment-demonstration', 'The equipment demonstration continues with the visiting delegation and hospital team.'),
    ],
  },
  {
    id: 'hamilton-c6-pgi-installation',
    title: 'Installed with purpose. Ready for the next step.',
    category: 'Installation', location: 'PGI Chandigarh', event_date: '',
    summary: 'HAMILTON-C6 ventilators supplied for installation at PGI Chandigarh. From delivery and equipment setup to coordination with the clinical team, our service engineers help bring respiratory technology into the hospital workflow.',
    photos: [photo('hamilton-c6-pgi-installation', 'HAMILTON-C6 ventilators supplied for installation at PGI Chandigarh.')],
  },
  {
    id: 'hamilton-c6-clinical-training',
    title: 'Training the next generation of care.',
    category: 'Training', location: 'HAMILTON-C6 · Clinical training', event_date: '',
    summary: 'Bringing the HAMILTON-C6 into focus through practical learning. A hands-on session introduces the next generation of healthcare professionals to the ventilator, with equipment guidance and discussion alongside the clinical team.',
    photos: [photo('hamilton-c6-clinical-training', 'Healthcare professionals gather around a HAMILTON-C6 for a practical equipment training session.')],
  },
].map((event, display_order) => ({
  ...event, display_order, is_published: true, is_demo: false, updated_at: 0,
  cover_image: event.photos[0].thumbnail, cover_alt: event.photos[0].alt,
  photo_count: event.photos.length,
  photos: event.photos.map((image, position) => ({ ...image, position })),
}))
