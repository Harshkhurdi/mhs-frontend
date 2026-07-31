-- Seed the products table with the legacy base catalog
INSERT INTO products (slug, name, specialty, brand, description, pdf_url, image_url)
VALUES
  ('hamilton-c1', 'Hamilton C1 Ventilator', 'critical-care', 'hamilton', 'Compact, fully featured ICU ventilator with intelligent weaning protocols and high-flow oxygen therapy.', '/docs/hamilton-c1.pdf', NULL),
  ('hamilton-c6', 'Hamilton C6 Ventilator', 'critical-care', 'hamilton', 'High-performance ventilator for adult to neonatal critical care with adaptive ventilation modes.', '/docs/hamilton-c6.pdf', NULL),
  ('spacelabs-xhibit-central', 'Spacelabs Xhibit Central Station', 'critical-care', 'spacelabs', 'Central monitoring system with multi-parameter telemetry for ICU environments.', '/docs/spacelabs-xhibit.pdf', NULL),
  ('samsung-rs85', 'Samsung RS85 Prestige', 'radiology', 'samsung', 'Premium ultrasound system with S-Vue and Crystal Architecture for exceptional image clarity.', '/docs/samsung-rs85.pdf', NULL),
  ('samsung-hs80', 'Samsung HS80', 'radiology', 'samsung', 'High-end ultrasound system with advanced 3D/4D imaging capabilities for comprehensive diagnostics.', '/docs/samsung-hs80.pdf', NULL),
  ('samsung-gc85', 'Samsung GC85 Digital X-Ray', 'radiology', 'samsung', 'Digital radiography system with fast workflow, low dose, and high image quality.', '/docs/samsung-gc85.pdf', NULL),
  ('linet-eleganza', 'Linet Eleganza 3 ICU Bed', 'ward-infrastructure', 'linet', 'Intelligent ICU bed with advanced pressure redistribution, weighing system, and Trendelenburg positioning.', '/docs/linet-eleganza3.pdf', NULL),
  ('linet-axioma', 'Linet Axioma Ward Bed', 'ward-infrastructure', 'linet', 'Ergonomic general ward bed with smart monitoring and fall prevention features.', '/docs/linet-axioma.pdf', NULL),
  ('linet-multicare', 'Linet Multicare ICU Bed', 'ward-infrastructure', 'linet', 'Versatile ICU bed with integrated patient monitoring and smart alarm systems.', '/docs/linet-multicare.pdf', NULL),
  ('spacelabs-monitor', 'Spacelabs Xhibit Patient Monitor', 'patient-monitoring', 'spacelabs', 'Multi-parameter bedside monitor with intuitive touch interface and wireless connectivity.', '/docs/spacelabs-monitor.pdf', NULL),
  ('spacelabs-telemetry', 'Spacelabs Telemetry System', 'patient-monitoring', 'spacelabs', 'Wireless telemetry system for continuous patient surveillance with alarm management.', '/docs/spacelabs-telemetry.pdf', NULL),
  ('hamilton-m1', 'Hamilton M1 Patient Monitor', 'patient-monitoring', 'hamilton', 'Integrated patient monitoring system with ventilator synchronization and clinical decision support.', '/docs/hamilton-m1.pdf', NULL)
ON CONFLICT (slug) DO NOTHING;