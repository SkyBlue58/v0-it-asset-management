-- Insert sample departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Information Technology', 'IT', 'IT Department'),
  ('Human Resources', 'HR', 'Human Resources Department'),
  ('Finance', 'FIN', 'Finance Department'),
  ('Operations', 'OPS', 'Operations Department')
ON CONFLICT (name) DO NOTHING;

-- Insert sample locations
INSERT INTO public.locations (building, floor, room, description) VALUES
  ('Main Building', '1', '101', 'IT Support Room'),
  ('Main Building', '2', '201', 'Server Room'),
  ('Main Building', '3', '301', 'Storage'),
  ('Building A', '1', 'A-101', 'Office Space')
ON CONFLICT DO NOTHING;

-- Insert sample asset categories
INSERT INTO public.asset_categories (name, code, description) VALUES
  ('Computer', 'COMP', 'Desktop and Laptop computers'),
  ('Monitor', 'MON', 'Display monitors'),
  ('Printer', 'PRT', 'Printers and scanners'),
  ('Network Equipment', 'NET', 'Routers, switches, and network devices'),
  ('Mobile Device', 'MOB', 'Smartphones and tablets'),
  ('Accessories', 'ACC', 'Keyboards, mice, and other accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample vendors
INSERT INTO public.vendors (name, code, contact_person, email, phone, category) VALUES
  ('Dell Technologies', 'DELL', 'John Smith', 'sales@dell.com', '02-XXX-XXXX', 'Hardware'),
  ('HP Inc.', 'HP', 'Jane Doe', 'sales@hp.com', '02-YYY-YYYY', 'Hardware'),
  ('Microsoft', 'MSFT', 'Bob Johnson', 'licensing@microsoft.com', '02-ZZZ-ZZZZ', 'Software'),
  ('Cisco Systems', 'CISCO', 'Alice Brown', 'sales@cisco.com', '02-AAA-AAAA', 'Network')
ON CONFLICT (code) DO NOTHING;
