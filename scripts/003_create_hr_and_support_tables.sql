-- Vendors/Suppliers
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) UNIQUE,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  website VARCHAR(200),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  contract_type VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  value DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
  responsible_person UUID REFERENCES public.users(id),
  documents JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Software Licenses
CREATE TABLE IF NOT EXISTS public.software_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  software_name VARCHAR(200) NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  license_key TEXT,
  license_type VARCHAR(50) CHECK (license_type IN ('perpetual', 'subscription', 'trial')),
  seats INTEGER,
  seats_used INTEGER DEFAULT 0,
  purchase_date DATE,
  expiry_date DATE,
  cost DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- License Assignments
CREATE TABLE IF NOT EXISTS public.license_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  license_id UUID REFERENCES public.software_licenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES public.assets(id),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  revoked_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  author_id UUID REFERENCES public.users(id),
  is_published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('info', 'warning', 'maintenance', 'update')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  author_id UUID REFERENCES public.users(id),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget tracking
CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE,
  fiscal_year INTEGER NOT NULL,
  allocated_amount DECIMAL(12, 2) NOT NULL,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_number VARCHAR(50) UNIQUE NOT NULL,
  budget_category_id UUID REFERENCES public.budget_categories(id),
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  expense_date DATE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  asset_id UUID REFERENCES public.assets(id),
  approved_by UUID REFERENCES public.users(id),
  receipt_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training records
CREATE TABLE IF NOT EXISTS public.training_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_name VARCHAR(200) NOT NULL,
  training_date DATE NOT NULL,
  completion_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  certificate_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view vendors" ON public.vendors FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage vendors" ON public.vendors FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view contracts" ON public.contracts FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage contracts" ON public.contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view licenses" ON public.software_licenses FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage licenses" ON public.software_licenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view their license assignments" ON public.license_assignments FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

CREATE POLICY "Everyone can view published KB articles" ON public.knowledge_base FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage KB" ON public.knowledge_base FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'technician'))
);

CREATE POLICY "Everyone can view active announcements" ON public.announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Managers can view budget" ON public.budget_categories FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins can manage budget" ON public.budget_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view expenses" ON public.expenses FOR SELECT USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Users can create expenses" ON public.expenses FOR INSERT WITH CHECK (
  created_by = auth.uid()
);

CREATE POLICY "Users can view their training" ON public.training_records FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Indexes
CREATE INDEX idx_contracts_vendor_id ON public.contracts(vendor_id);
CREATE INDEX idx_contracts_end_date ON public.contracts(end_date);
CREATE INDEX idx_software_licenses_expiry_date ON public.software_licenses(expiry_date);
CREATE INDEX idx_license_assignments_user_id ON public.license_assignments(user_id);
CREATE INDEX idx_expenses_budget_category_id ON public.expenses(budget_category_id);
CREATE INDEX idx_training_records_user_id ON public.training_records(user_id);
