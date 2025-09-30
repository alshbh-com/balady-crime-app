-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create special offers table
CREATE TABLE public.special_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  discount_percentage INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Anyone can view active offers"
ON public.special_offers FOR SELECT
USING (is_active = true);

-- Admin policies (we'll use service role for admin operations)
CREATE POLICY "Service role can manage categories"
ON public.categories FOR ALL
USING (true);

CREATE POLICY "Service role can manage products"
ON public.products FOR ALL
USING (true);

CREATE POLICY "Service role can manage offers"
ON public.special_offers FOR ALL
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, name_ar, icon, display_order) VALUES
('Burgers', 'برجر', '🍔', 1),
('Pizza', 'بيتزا', '🍕', 2),
('Chicken', 'فراخ', '🍗', 3),
('Drinks', 'مشروبات', '🥤', 4);

-- Insert sample products
INSERT INTO public.products (name, name_ar, description, description_ar, price, category_id, is_featured) VALUES
-- Burgers
('Deluxe Burger', 'برجر ديلوكس', 'Classic beef burger with special sauce', 'برجر لحم بقري مع صوص خاص', 85.00, (SELECT id FROM categories WHERE name = 'Burgers'), true),
('Chicken Burger', 'برجر دجاج', 'Crispy chicken with lettuce and mayo', 'دجاج كريسبي مع خس ومايونيز', 70.00, (SELECT id FROM categories WHERE name = 'Burgers'), false),
('Double Cheese Burger', 'دبل تشيز برجر', 'Two beef patties with double cheese', 'قطعتين لحم مع جبن مضاعف', 110.00, (SELECT id FROM categories WHERE name = 'Burgers'), true),

-- Pizza
('Margherita Pizza', 'بيتزا مارجريتا', 'Classic tomato and cheese pizza', 'بيتزا كلاسيك بالطماطم والجبن', 95.00, (SELECT id FROM categories WHERE name = 'Pizza'), false),
('Pepperoni Pizza', 'بيتزا ببروني', 'Spicy pepperoni with mozzarella', 'ببروني حار مع موتزاريلا', 120.00, (SELECT id FROM categories WHERE name = 'Pizza'), true),
('Chicken BBQ Pizza', 'بيتزا دجاج باربيكيو', 'BBQ chicken with onions and peppers', 'دجاج باربيكيو مع بصل وفلفل', 130.00, (SELECT id FROM categories WHERE name = 'Pizza'), false),

-- Chicken
('Crispy Chicken', 'دجاج كريسبي', 'Golden crispy fried chicken', 'دجاج مقلي ذهبي مقرمش', 90.00, (SELECT id FROM categories WHERE name = 'Chicken'), true),
('Grilled Chicken', 'دجاج مشوي', 'Healthy grilled chicken breast', 'صدور دجاج مشوي صحي', 85.00, (SELECT id FROM categories WHERE name = 'Chicken'), false),
('Chicken Wings', 'أجنحة دجاج', 'Spicy buffalo wings', 'أجنحة دجاج بافلو حارة', 75.00, (SELECT id FROM categories WHERE name = 'Chicken'), false),

-- Drinks
('Fresh Orange Juice', 'عصير برتقال طازج', 'Freshly squeezed orange juice', 'عصير برتقال طازج معصور', 25.00, (SELECT id FROM categories WHERE name = 'Drinks'), false),
('Coca Cola', 'كوكاكولا', 'Cold refreshing Coca Cola', 'كوكاكولا باردة منعشة', 15.00, (SELECT id FROM categories WHERE name = 'Drinks'), false),
('Mineral Water', 'مياه معدنية', 'Pure mineral water', 'مياه معدنية نقية', 10.00, (SELECT id FROM categories WHERE name = 'Drinks'), false);

-- Insert sample special offers
INSERT INTO public.special_offers (title, title_ar, description, description_ar, discount_percentage, is_active) VALUES
('Weekend Special', 'عرض نهاية الأسبوع', 'Get 20% off on all orders this weekend', 'احصل على خصم 20% على جميع الطلبات في نهاية الأسبوع', 20, true),
('Family Combo', 'كومبو العائلة', '2 Burgers + 2 Pizzas + 4 Drinks for 350 EGP', '2 برجر + 2 بيتزا + 4 مشروبات بـ 350 جنيه', 25, true);