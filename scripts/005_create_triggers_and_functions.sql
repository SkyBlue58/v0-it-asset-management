-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_borrow_requests_updated_at BEFORE UPDATE ON public.borrow_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pm_schedules_updated_at BEFORE UPDATE ON public.pm_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, employee_id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_num INTEGER;
  new_number TEXT;
BEGIN
  SELECT setting_value INTO prefix FROM public.system_settings WHERE setting_key = 'ticket_auto_number_prefix';
  IF prefix IS NULL THEN
    prefix := 'TKT';
  END IF;
  
  SELECT COUNT(*) + 1 INTO next_num FROM public.tickets;
  new_number := prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(next_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign ticket number
CREATE OR REPLACE FUNCTION auto_assign_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number BEFORE INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION auto_assign_ticket_number();

-- Function to generate borrow request number
CREATE OR REPLACE FUNCTION generate_borrow_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  new_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO next_num FROM public.borrow_requests;
  new_number := 'BRW-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_assign_borrow_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
    NEW.request_number := generate_borrow_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_borrow_number BEFORE INSERT ON public.borrow_requests
  FOR EACH ROW EXECUTE FUNCTION auto_assign_borrow_number();

-- Function to check asset availability
CREATE OR REPLACE FUNCTION check_asset_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT status FROM public.assets WHERE id = NEW.asset_id) != 'available' THEN
    RAISE EXCEPTION 'Asset is not available for borrowing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_asset_before_borrow BEFORE INSERT ON public.borrow_requests
  FOR EACH ROW EXECUTE FUNCTION check_asset_availability();

-- Function to update asset status when borrowed/returned
CREATE OR REPLACE FUNCTION update_asset_status_on_borrow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'borrowed' AND OLD.status != 'borrowed' THEN
    UPDATE public.assets SET status = 'in_use' WHERE id = NEW.asset_id;
  ELSIF NEW.status = 'returned' AND OLD.status = 'borrowed' THEN
    UPDATE public.assets SET status = 'available' WHERE id = NEW.asset_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_asset_on_borrow_status AFTER UPDATE ON public.borrow_requests
  FOR EACH ROW EXECUTE FUNCTION update_asset_status_on_borrow();
