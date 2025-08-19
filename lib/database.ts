// 데이터베이스 스키마 생성 SQL
// Supabase SQL Editor에서 실행하거나 마이그레이션으로 적용

export const CREATE_TABLES_SQL = `
-- 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'staff')) DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 공급업체 테이블
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  lead_time_days INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 테이블
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
  selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  min_stock_level INTEGER NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
  max_stock_level INTEGER CHECK (max_stock_level >= min_stock_level),
  unit TEXT NOT NULL DEFAULT '개',
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 재고 거래 테이블
CREATE TABLE IF NOT EXISTS public.stock_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  reference_number TEXT,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 입고 상세 정보 테이블
CREATE TABLE IF NOT EXISTS public.stock_in_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.stock_transactions(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  expected_delivery_date DATE,
  actual_delivery_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 출고 상세 정보 테이블
CREATE TABLE IF NOT EXISTS public.stock_out_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.stock_transactions(id) ON DELETE CASCADE,
  customer_name TEXT,
  order_number TEXT
);

-- 발주 테이블
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  notes TEXT,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 발주 상세 테이블
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0)
);

-- 매출 테이블
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  customer_name TEXT,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')) DEFAULT 'cash',
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('low_stock', 'order_delivery', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_product ON public.stock_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_type ON public.stock_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_date ON public.stock_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_product ON public.sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 재고 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'in' THEN
    UPDATE public.products 
    SET current_stock = current_stock + NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
  ELSIF NEW.transaction_type = 'out' THEN
    UPDATE public.products 
    SET current_stock = current_stock - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_product_stock AFTER INSERT ON public.stock_transactions
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
`;

// 샘플 데이터 삽입 SQL
export const INSERT_SAMPLE_DATA_SQL = `
-- 샘플 공급업체 데이터
INSERT INTO public.suppliers (name, contact_person, email, phone, address, payment_terms, lead_time_days) VALUES
('ABC 공급업체', '김공급', 'abc@supplier.com', '02-1234-5678', '서울시 강남구', '30일 후 지급', 7),
('XYZ 물류', '박물류', 'xyz@logistics.com', '02-2345-6789', '서울시 서초구', '15일 후 지급', 5),
('한국상사', '이상사', 'korea@company.com', '02-3456-7890', '서울시 마포구', '45일 후 지급', 10);

-- 샘플 상품 데이터
INSERT INTO public.products (name, sku, category, description, cost_price, selling_price, current_stock, min_stock_level, max_stock_level, unit, supplier_id) VALUES
('프리미엄 커피', 'COFFEE-001', '음료', '아라비카 원두 커피', 5000, 8000, 100, 20, 200, '개', (SELECT id FROM public.suppliers WHERE name = 'ABC 공급업체')),
('유기농 차', 'TEA-001', '음료', '녹차 잎', 3000, 5000, 50, 10, 100, '개', (SELECT id FROM public.suppliers WHERE name = 'XYZ 물류')),
('수제 쿠키', 'COOKIE-001', '과자', '버터 쿠키', 2000, 3500, 75, 15, 150, '개', (SELECT id FROM public.suppliers WHERE name = '한국상사'));
`;
