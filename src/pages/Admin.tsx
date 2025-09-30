import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, LogOut, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name_ar: string;
  description_ar?: string;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  category_id?: string;
}

interface Category {
  id: string;
  name_ar: string;
}

interface Offer {
  id: string;
  title_ar: string;
  description_ar?: string;
  discount_percentage?: number;
  is_active: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth") === "true";
    if (!isAdmin) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/settings");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const [productsRes, categoriesRes, offersRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
      supabase.from("special_offers").select("*"),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (offersRes.data) setOffers(offersRes.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    toast.success("تم تسجيل الخروج");
    navigate("/settings");
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name_ar: formData.get("name_ar") as string,
      description_ar: formData.get("description_ar") as string,
      price: parseFloat(formData.get("price") as string),
      category_id: formData.get("category_id") as string || null,
      is_featured: formData.get("is_featured") === "true",
      is_available: formData.get("is_available") === "true",
      name: formData.get("name_ar") as string,
      description: formData.get("description_ar") as string,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", editingProduct.id);
      if (error) {
        toast.error("حدث خطأ في التحديث");
        return;
      }
      toast.success("تم تحديث المنتج بنجاح");
    } else {
      const { error } = await supabase.from("products").insert([data]);
      if (error) {
        toast.error("حدث خطأ في الإضافة");
        return;
      }
      toast.success("تم إضافة المنتج بنجاح");
    }

    setIsProductDialogOpen(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }
    toast.success("تم حذف المنتج");
    fetchData();
  };

  const handleSaveOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title_ar: formData.get("title_ar") as string,
      description_ar: formData.get("description_ar") as string,
      discount_percentage: parseInt(formData.get("discount_percentage") as string) || null,
      is_active: formData.get("is_active") === "true",
      title: formData.get("title_ar") as string,
      description: formData.get("description_ar") as string,
    };

    if (editingOffer) {
      const { error } = await supabase
        .from("special_offers")
        .update(data)
        .eq("id", editingOffer.id);
      if (error) {
        toast.error("حدث خطأ في التحديث");
        return;
      }
      toast.success("تم تحديث العرض بنجاح");
    } else {
      const { error } = await supabase.from("special_offers").insert([data]);
      if (error) {
        toast.error("حدث خطأ في الإضافة");
        return;
      }
      toast.success("تم إضافة العرض بنجاح");
    }

    setIsOfferDialogOpen(false);
    setEditingOffer(null);
    fetchData();
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    
    const { error } = await supabase.from("special_offers").delete().eq("id", id);
    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }
    toast.success("تم حذف العرض");
    fetchData();
  };

  return (
    <div className="min-h-screen pb-20 gradient-warm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Package className="ml-2 h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Sparkles className="ml-2 h-4 w-4" />
              العروض الخاصة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-fire" onClick={() => setEditingProduct(null)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">اسم المنتج *</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      defaultValue={editingProduct?.name_ar}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ar">الوصف</Label>
                    <Textarea
                      id="description_ar"
                      name="description_ar"
                      defaultValue={editingProduct?.description_ar}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">السعر (ج.م) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.price}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category_id">القسم</Label>
                      <Select name="category_id" defaultValue={editingProduct?.category_id}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name_ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_featured"
                        name="is_featured"
                        defaultChecked={editingProduct?.is_featured}
                        value="true"
                      />
                      <Label htmlFor="is_featured">منتج مميز</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_available"
                        name="is_available"
                        defaultChecked={editingProduct?.is_available ?? true}
                        value="true"
                      />
                      <Label htmlFor="is_available">متاح</Label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-fire">
                    حفظ
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{product.name_ar}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description_ar}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {product.price.toFixed(2)} ج.م
                      </p>
                      <div className="flex gap-2 mt-2">
                        {product.is_featured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            مميز
                          </span>
                        )}
                        {!product.is_available && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                            غير متاح
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-fire" onClick={() => setEditingOffer(null)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة عرض جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveOffer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_ar">عنوان العرض *</Label>
                    <Input
                      id="title_ar"
                      name="title_ar"
                      defaultValue={editingOffer?.title_ar}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ar">وصف العرض</Label>
                    <Textarea
                      id="description_ar"
                      name="description_ar"
                      defaultValue={editingOffer?.description_ar}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_percentage">نسبة الخصم (%)</Label>
                    <Input
                      id="discount_percentage"
                      name="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={editingOffer?.discount_percentage}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      name="is_active"
                      defaultChecked={editingOffer?.is_active ?? true}
                      value="true"
                    />
                    <Label htmlFor="is_active">العرض نشط</Label>
                  </div>
                  <Button type="submit" className="w-full gradient-fire">
                    حفظ
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{offer.title_ar}</h3>
                      <p className="text-sm text-muted-foreground">
                        {offer.description_ar}
                      </p>
                      {offer.discount_percentage && (
                        <p className="text-lg font-bold text-primary mt-2">
                          خصم {offer.discount_percentage}%
                        </p>
                      )}
                      {!offer.is_active && (
                        <span className="inline-block text-xs bg-destructive/10 text-destructive px-2 py-1 rounded mt-2">
                          غير نشط
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingOffer(offer);
                        setIsOfferDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
