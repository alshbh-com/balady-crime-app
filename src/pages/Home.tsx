import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Sparkles, Phone, PhoneCall } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-food.jpg";
import burgerImage from "@/assets/burger-deluxe.jpg";
import chickenImage from "@/assets/chicken-crispy.jpg";
import pizzaImage from "@/assets/pizza-pepperoni.jpg";

interface Product {
  id: string;
  name_ar: string;
  description_ar?: string;
  price: number;
  image_url?: string;
  is_featured: boolean;
  category_id?: string;
}

interface Category {
  id: string;
  name_ar: string;
  icon?: string;
}

interface Offer {
  id: string;
  title_ar: string;
  description_ar?: string;
  discount_percentage?: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mapping for demo images
  const imageMap: Record<string, string> = {
    "Deluxe Burger": burgerImage,
    "Double Cheese Burger": burgerImage,
    "Chicken Burger": chickenImage,
    "Crispy Chicken": chickenImage,
    "Grilled Chicken": chickenImage,
    "Chicken Wings": chickenImage,
    "Pepperoni Pizza": pizzaImage,
    "Chicken BBQ Pizza": pizzaImage,
    "Margherita Pizza": pizzaImage,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, offersRes] = await Promise.all([
          supabase.from("products").select("*").eq("is_available", true),
          supabase.from("categories").select("*").order("display_order"),
          supabase.from("special_offers").select("*").eq("is_active", true),
        ]);

        if (productsRes.data) {
          const productsWithImages = productsRes.data.map(product => ({
            ...product,
            image_url: product.image_url || imageMap[product.name] || burgerImage
          }));
          setProducts(productsWithImages);
        }
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (offersRes.data) setOffers(offersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div className="min-h-screen pb-20 gradient-warm">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="جريمة بلدي"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 right-6 text-white">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">جريمة بلدي</h1>
          <p className="text-lg opacity-95 drop-shadow">أشهى المأكولات البلدية</p>
          <div className="flex gap-3 mt-3">
            <a href="tel:01025500588" className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Phone className="h-4 w-4" />
              01025500588
            </a>
            <a href="tel:01027262395" className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <PhoneCall className="h-4 w-4" />
              01027262395
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Special Offers */}
        {offers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              العروض الخاصة
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-4 gradient-fire text-white shadow-glow animate-pulse-soft">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{offer.title_ar}</h3>
                      <p className="text-white/90">{offer.description_ar}</p>
                    </div>
                    {offer.discount_percentage && (
                      <div className="bg-white text-primary rounded-full h-16 w-16 flex items-center justify-center font-bold text-lg shadow-lg">
                        {offer.discount_percentage}%
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">الأكثر طلباً</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "gradient-fire text-white shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "gradient-fire text-white shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.icon} {cat.name_ar}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">القائمة</h2>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
