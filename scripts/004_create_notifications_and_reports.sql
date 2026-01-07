-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('ticket', 'asset', 'pm', 'borrow', 'toner', 'license', 'contract', 'system')),
  reference_id UUID,
  reference_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
  ('company_name', 'IT Asset Management System', 'Organization name'),
  ('ticket_auto_number_prefix', 'TKT', 'Ticket number prefix'),
  ('asset_auto_number_prefix', 'AST', 'Asset code prefix'),
  ('notification_email_enabled', 'true', 'Enable email notifications'),
  ('maintenance_mode', 'false', 'System maintenance mode'),
  ('ldap_enabled', 'true', 'Enable LDAP/AD authentication'),
  ('ldap_server', '', 'LDAP server address'),
  ('ldap_base_dn', '', 'LDAP base DN'),
  ('default_ticket_priority', 'Medium', 'Default priority for new tickets')
ON CONFLICT (setting_key) DO NOTHING;

-- Saved Reports
CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  report_type VARCHAR(100) NOT NULL,
  filters JSONB,
  created_by UUID REFERENCES public.users(id),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard Widgets
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  widget_type VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL,
  size VARCHAR(20) DEFAULT 'medium',
  config JSONB,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Everyone can view system settings" ON public.system_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view public reports" ON public.saved_reports FOR SELECT USING (
  is_public = TRUE OR created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Users can create reports" ON public.saved_reports FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can manage own widgets" ON public.dashboard_widgets FOR ALL USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_saved_reports_created_by ON public.saved_reports(created_by);
CREATE INDEX idx_dashboard_widgets_user_id ON public.dashboard_widgets(user_id);
