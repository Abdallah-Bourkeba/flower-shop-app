-- 1. Create Refunds (Reverse Invoices) Table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  amount_ex_tax DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE refunds DISABLE ROW LEVEL SECURITY;

-- 2. Update Purchases Table for Tax Handling
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS cost_ex_tax DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0;

-- 3. Update Orders Table for Order Status Tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'completed';
