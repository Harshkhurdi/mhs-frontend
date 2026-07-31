export const clinicalSpecialties = [
  {
    id: 'critical-care',
    name: 'Critical Care & ICU',
    description: 'Mechanical ventilators, intelligent respiratory systems',
  },
  {
    id: 'radiology',
    name: 'Radiology & Diagnostics',
    description: 'Premium ultrasound scanners, digital X-Ray units',
  },
  {
    id: 'ward-infrastructure',
    name: 'Ward Infrastructure',
    description: 'Advanced ICU beds, ergonomic patient positioners',
  },
  {
    id: 'patient-monitoring',
    name: 'Patient Monitoring',
    description: 'High-acuity patient monitors, telemetry networks',
  },
]

export const manufacturerBrands = [
  {
    id: 'hamilton',
    name: 'Hamilton Medical',
    description: 'Ventilation solutions',
  },
  {
    id: 'samsung',
    name: 'Samsung Healthcare',
    description: 'Radiology & premium imaging diagnostics',
  },
  {
    id: 'linet',
    name: 'Linet',
    description: 'Clinical beds & nursing care furniture',
  },
  {
    id: 'spacelabs',
    name: 'Spacelabs Healthcare',
    description: 'Cardiology devices & precision monitoring',
  },
]

export const products = [
  // Critical Care & ICU
  {
    id: 'hamilton-c1',
    name: 'Hamilton C1 Ventilator',
    specialty: 'critical-care',
    brand: 'hamilton',
    description:
      'Compact, fully featured ICU ventilator with intelligent weaning protocols and high-flow oxygen therapy.',
    image: null,
    pdfUrl: '/docs/hamilton-c1.pdf',
  },
  {
    id: 'hamilton-c6',
    name: 'Hamilton C6 Ventilator',
    specialty: 'critical-care',
    brand: 'hamilton',
    description:
      'High-performance ventilator for adult to neonatal critical care with adaptive ventilation modes.',
    image: null,
    pdfUrl: '/docs/hamilton-c6.pdf',
  },
  {
    id: 'spacelabs-icgm',
    name: 'Spacelabs Xhibit Central Station',
    specialty: 'critical-care',
    brand: 'spacelabs',
    description:
      'Central monitoring system with multi-parameter telemetry for ICU environments.',
    image: null,
    pdfUrl: '/docs/spacelabs-xhibit.pdf',
  },

  // Radiology & Diagnostics
  {
    id: 'samsung-rs85',
    name: 'Samsung RS85 Prestige',
    specialty: 'radiology',
    brand: 'samsung',
    description:
      'Premium ultrasound system with S-Vue and Crystal Architecture for exceptional image clarity.',
    image: null,
    pdfUrl: '/docs/samsung-rs85.pdf',
  },
  {
    id: 'samsung-hs80',
    name: 'Samsung HS80',
    specialty: 'radiology',
    brand: 'samsung',
    description:
      'High-end ultrasound system with advanced 3D/4D imaging capabilities for comprehensive diagnostics.',
    image: null,
    pdfUrl: '/docs/samsung-hs80.pdf',
  },
  {
    id: 'samsung-gc85',
    name: 'Samsung GC85 Digital X-Ray',
    specialty: 'radiology',
    brand: 'samsung',
    description:
      'Digital radiography system with fast workflow, low dose, and high image quality.',
    image: null,
    pdfUrl: '/docs/samsung-gc85.pdf',
  },

  // Ward Infrastructure
  {
    id: 'linet-eleganza',
    name: 'Linet Eleganza 3 ICU Bed',
    specialty: 'ward-infrastructure',
    brand: 'linet',
    description:
      'Intelligent ICU bed with advanced pressure redistribution, weighing system, and Trendelenburg positioning.',
    image: null,
    pdfUrl: '/docs/linet-eleganza3.pdf',
  },
  {
    id: 'linet-axioma',
    name: 'Linet Axioma Ward Bed',
    specialty: 'ward-infrastructure',
    brand: 'linet',
    description:
      'Ergonomic general ward bed with smart monitoring and fall prevention features.',
    image: null,
    pdfUrl: '/docs/linet-axioma.pdf',
  },
  {
    id: 'linet-multicare',
    name: 'Linet Multicare ICU Bed',
    specialty: 'ward-infrastructure',
    brand: 'linet',
    description:
      'Versatile ICU bed with integrated patient monitoring and smart alarm systems.',
    image: null,
    pdfUrl: '/docs/linet-multicare.pdf',
  },

  // Patient Monitoring
  {
    id: 'spacelabs-icgm2',
    name: 'Spacelabs Xhibit Patient Monitor',
    specialty: 'patient-monitoring',
    brand: 'spacelabs',
    description:
      'Multi-parameter bedside monitor with intuitive touch interface and wireless connectivity.',
    image: null,
    pdfUrl: '/docs/spacelabs-monitor.pdf',
  },
  {
    id: 'spacelabs-telemetry',
    name: 'Spacelabs Telemetry System',
    specialty: 'patient-monitoring',
    brand: 'spacelabs',
    description:
      'Wireless telemetry system for continuous patient surveillance with alarm management.',
    image: null,
    pdfUrl: '/docs/spacelabs-telemetry.pdf',
  },
  {
    id: 'hamilton-m1',
    name: 'Hamilton M1 Patient Monitor',
    specialty: 'patient-monitoring',
    brand: 'hamilton',
    description:
      'Integrated patient monitoring system with ventilator synchronization and clinical decision support.',
    image: null,
    pdfUrl: '/docs/hamilton-m1.pdf',
  },
]