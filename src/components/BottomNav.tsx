import { Home, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const BottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive("/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">الرئيسية</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center gap-1 transition-colors relative ${
            isActive("/cart")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-fire">
                {totalItems}
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium">السلة</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive("/settings")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs font-medium">الإعدادات</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
