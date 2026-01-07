-- Preventive Maintenance Schedule
CREATE TABLE IF NOT EXISTS public.pm_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  frequency_days INTEGER NOT NULL,
  last_pm_date DATE,
  next_pm_date DATE NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PM Records
CREATE TABLE IF NOT EXISTS public.pm_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES public.pm_schedules(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  performed_by UUID REFERENCES public.users(id) NOT NULL,
  performed_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'skipped')),
  notes TEXT,
  next_pm_date DATE,
  checklist_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toner/Ink Management
CREATE TABLE IF NOT EXISTS public.toner_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  manufacturer VARCHAR(100),
  color VARCHAR(50),
  type VARCHAR(50) CHECK (type IN ('toner', 'ink', 'drum', 'fuser')),
  compatible_printers TEXT[],
  price DECIMAL(10, 2),
  min_stock_level INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toner Stock
CREATE TABLE IF NOT EXISTS public.toner_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  toner_model_id UUID REFERENCES public.toner_models(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Toner Transactions
CREATE TABLE IF NOT EXISTS public.toner_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number VARCHAR(50) UNIQUE NOT NULL,
  toner_model_id UUID REFERENCES public.toner_models(id),
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('receive', 'issue', 'return', 'adjust')),
  quantity INTEGER NOT NULL,
  from_location_id UUID REFERENCES public.locations(id),
  to_location_id UUID REFERENCES public.locations(id),
  requester_id UUID REFERENCES public.users(id),
  approved_by UUID REFERENCES public.users(id),
  asset_id UUID REFERENCES public.assets(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toner_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toner_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toner_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view PM schedules" ON public.pm_schedules FOR SELECT USING (TRUE);
CREATE POLICY "Technicians can manage PM schedules" ON public.pm_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

CREATE POLICY "Everyone can view PM records" ON public.pm_records FOR SELECT USING (TRUE);
CREATE POLICY "Technicians can create PM records" ON public.pm_records FOR INSERT WITH CHECK (
  performed_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

CREATE POLICY "Everyone can view toner models" ON public.toner_models FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage toner models" ON public.toner_models FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view toner stock" ON public.toner_stock FOR SELECT USING (TRUE);
CREATE POLICY "Technicians can update stock" ON public.toner_stock FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

CREATE POLICY "Everyone can view toner transactions" ON public.toner_transactions FOR SELECT USING (TRUE);
CREATE POLICY "Users can create toner requests" ON public.toner_transactions FOR INSERT WITH CHECK (
  requester_id = auth.uid()
);

-- Indexes
CREATE INDEX idx_pm_schedules_asset_id ON public.pm_schedules(asset_id);
CREATE INDEX idx_pm_schedules_next_pm_date ON public.pm_schedules(next_pm_date);
CREATE INDEX idx_pm_records_schedule_id ON public.pm_records(schedule_id);
CREATE INDEX idx_toner_stock_toner_model_id ON public.toner_stock(toner_model_id);
CREATE INDEX idx_toner_transactions_toner_model_id ON public.toner_transactions(toner_model_id);
