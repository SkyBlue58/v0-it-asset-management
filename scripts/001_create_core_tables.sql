-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  email TEXT NOT NULL UNIQUE,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'technician', 'user', 'manager')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) UNIQUE,
  manager_id UUID REFERENCES public.users(id),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(20),
  room VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset categories
CREATE TABLE IF NOT EXISTS public.asset_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.asset_categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES public.asset_categories(id),
  serial_number VARCHAR(100),
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  purchase_date DATE,
  purchase_price DECIMAL(12, 2),
  warranty_end_date DATE,
  location_id UUID REFERENCES public.locations(id),
  assigned_to UUID REFERENCES public.users(id),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired', 'lost')),
  condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket priorities
CREATE TABLE IF NOT EXISTS public.ticket_priorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  level INTEGER NOT NULL UNIQUE,
  color VARCHAR(20),
  response_time_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default priorities
INSERT INTO public.ticket_priorities (name, level, color, response_time_hours) VALUES
  ('Low', 1, 'green', 72),
  ('Medium', 2, 'yellow', 24),
  ('High', 3, 'orange', 8),
  ('Critical', 4, 'red', 2)
ON CONFLICT (name) DO NOTHING;

-- Tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  priority_id UUID REFERENCES public.ticket_priorities(id),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending', 'resolved', 'closed', 'cancelled')),
  requester_id UUID REFERENCES public.users(id) NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  location_id UUID REFERENCES public.locations(id),
  asset_id UUID REFERENCES public.assets(id),
  due_date TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket comments
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Borrow/Return system
CREATE TABLE IF NOT EXISTS public.borrow_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number VARCHAR(50) UNIQUE NOT NULL,
  asset_id UUID REFERENCES public.assets(id) NOT NULL,
  requester_id UUID REFERENCES public.users(id) NOT NULL,
  approved_by UUID REFERENCES public.users(id),
  borrow_date DATE NOT NULL,
  expected_return_date DATE NOT NULL,
  actual_return_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue')),
  purpose TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can insert users" ON public.users FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for departments
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for locations
CREATE POLICY "Everyone can view locations" ON public.locations FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for asset_categories
CREATE POLICY "Everyone can view asset categories" ON public.asset_categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage asset categories" ON public.asset_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for assets
CREATE POLICY "Everyone can view assets" ON public.assets FOR SELECT USING (TRUE);
CREATE POLICY "Admins and technicians can manage assets" ON public.assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

-- RLS Policies for ticket_priorities
CREATE POLICY "Everyone can view priorities" ON public.ticket_priorities FOR SELECT USING (TRUE);

-- RLS Policies for tickets
CREATE POLICY "Users can view their tickets" ON public.tickets FOR SELECT USING (
  requester_id = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);
CREATE POLICY "Users can create tickets" ON public.tickets FOR INSERT WITH CHECK (
  requester_id = auth.uid()
);
CREATE POLICY "Technicians and admins can update tickets" ON public.tickets FOR UPDATE USING (
  assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

-- RLS Policies for ticket_comments
CREATE POLICY "Users can view comments on their tickets" ON public.ticket_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tickets 
    WHERE tickets.id = ticket_comments.ticket_id 
    AND (tickets.requester_id = auth.uid() OR tickets.assigned_to = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician')))
  )
);
CREATE POLICY "Authenticated users can add comments" ON public.ticket_comments FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- RLS Policies for borrow_requests
CREATE POLICY "Users can view their borrow requests" ON public.borrow_requests FOR SELECT USING (
  requester_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);
CREATE POLICY "Users can create borrow requests" ON public.borrow_requests FOR INSERT WITH CHECK (
  requester_id = auth.uid()
);
CREATE POLICY "Admins and technicians can update requests" ON public.borrow_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

-- Create indexes for better performance
CREATE INDEX idx_assets_assigned_to ON public.assets(assigned_to);
CREATE INDEX idx_assets_category_id ON public.assets(category_id);
CREATE INDEX idx_assets_location_id ON public.assets(location_id);
CREATE INDEX idx_tickets_requester_id ON public.tickets(requester_id);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_borrow_requests_requester_id ON public.borrow_requests(requester_id);
CREATE INDEX idx_borrow_requests_asset_id ON public.borrow_requests(asset_id);
