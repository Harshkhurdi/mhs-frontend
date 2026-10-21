export const eventCategories = ['Conference', 'Workshop', 'Training', 'Community']

const samples = [
  ['technology-showcase', 'Medical technology showcase', 'Conference', '2026-09-18', 'Chandigarh', 'An example album for conversations about medical technology and the people behind it.', 'conference'],
  ['equipment-workshop', 'A closer look at clinical equipment', 'Workshop', '2026-08-22', 'Mohali', 'A sample album for hands-on equipment sessions, demonstrations and shared learning.', 'workshop'],
  ['critical-care-exchange', 'Critical care, shared knowledge', 'Training', '2026-07-16', 'Chandigarh', 'An example of how training sessions and clinical discussions can be shared with your visitors.', 'audience'],
  ['imaging-forum', 'Imaging and surgical technology forum', 'Conference', '2026-06-12', 'New Delhi', 'A sample conference album for product discussions, new ideas and professional connections.', 'forum'],
  ['service-learning', 'Learning that supports better service', 'Workshop', '2026-05-23', 'Mohali', 'An example album for technical workshops and service engineering knowledge exchange.', 'learning'],
  ['healthcare-connections', 'Partners in better healthcare', 'Community', '2026-04-10', 'Chandigarh', 'A sample album for the partnerships and conversations that bring healthcare teams together.', 'connections'],
]

export const demoEvents = samples.map(([id, title, category, event_date, location, summary, image]) => ({
  id: `demo-${id}`,
  title,
  category,
  event_date,
  location,
  summary,
  cover_image: `/images/events/demo-${image}.webp`,
  cover_alt: `Representative stock photograph for the ${title.toLowerCase()} demo album`,
  photo_count: 1,
  is_demo: true,
  is_published: true,
  updated_at: 0,
  photos: [{ id: 'sample-photo', src: `/images/events/demo-${image}.webp`, thumbnail: `/images/events/demo-${image}.webp`, alt: 'Representative conference or workshop photograph', position: 0 }],
}))
