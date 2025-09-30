import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name_ar: string;
  description_ar?: string;
  price: number;
  image_url?: string;
  is_featured?: boolean;
}

const ProductCard = ({ id, name_ar, description_ar, price, image_url, is_featured }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name_ar, price, image_url });
    toast.success(`تم إضافة ${name_ar} إلى السلة`);
  };

  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        {image_url && (
          <img
            src={image_url}
            alt={name_ar}
            className="w-full h-48 object-cover"
          />
        )}
        {is_featured && (
          <div className="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            مميز
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">{name_ar}</h3>
          {description_ar && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description_ar}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {price.toFixed(2)} ج.م
          </span>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="gradient-fire hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 ml-1" />
            أضف للسلة
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
