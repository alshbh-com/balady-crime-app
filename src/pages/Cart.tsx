import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  phone: z.string().trim().min(11, "رقم الهاتف غير صحيح").max(15),
  address: z.string().trim().min(10, "العنوان يجب أن يكون 10 أحرف على الأقل").max(500),
});

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmitOrder = () => {
    try {
      const validated = orderSchema.parse(customerInfo);
      
      if (cart.length === 0) {
        toast.error("السلة فارغة! أضف منتجات أولاً");
        return;
      }

      const orderText = cart
        .map((item) => `${item.name_ar} × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ج.م`)
        .join("\n");

      const message = encodeURIComponent(
        `🍔 *طلب جديد من جريمة بلدي*\n\n` +
        `👤 *الاسم:* ${validated.name}\n` +
        `📱 *الهاتف:* ${validated.phone}\n` +
        `📍 *العنوان:* ${validated.address}\n\n` +
        `🛒 *الطلب:*\n${orderText}\n\n` +
        `💰 *الإجمالي:* ${totalPrice.toFixed(2)} ج.م`
      );

      window.open(`https://wa.me/201025500588?text=${message}`, "_blank");
      
      toast.success("تم إرسال الطلب بنجاح!");
      clearCart();
      setCustomerInfo({ name: "", phone: "", address: "" });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("يرجى التحقق من البيانات المدخلة");
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pb-20 gradient-warm flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">السلة فارغة</h2>
          <p className="text-muted-foreground mb-4">
            لم تقم بإضافة أي منتجات للسلة بعد
          </p>
          <Button className="gradient-fire" onClick={() => window.location.href = "/"}>
            تصفح المنتجات
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 gradient-warm">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">السلة</h1>

        {/* Cart Items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name_ar}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name_ar}</h3>
                  <p className="text-primary font-bold">{item.price.toFixed(2)} ج.م</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                      className="mr-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-left font-bold text-lg">
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Customer Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">معلومات التوصيل</h2>
          
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              placeholder="أدخل اسمك"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, phone: e.target.value });
                setErrors({ ...errors, phone: "" });
              }}
              placeholder="01XXXXXXXXX"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان *</Label>
            <Textarea
              id="address"
              value={customerInfo.address}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, address: e.target.value });
                setErrors({ ...errors, address: "" });
              }}
              placeholder="أدخل عنوانك بالتفصيل"
              rows={3}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>
        </Card>

        {/* Total and Checkout */}
        <Card className="p-6 space-y-4 shadow-glow">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>الإجمالي:</span>
            <span className="gradient-fire bg-clip-text text-transparent">
              {totalPrice.toFixed(2)} ج.م
            </span>
          </div>
          <Button
            onClick={handleSubmitOrder}
            className="w-full h-12 text-lg gradient-fire hover:opacity-90"
          >
            إتمام الطلب عبر واتساب
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
