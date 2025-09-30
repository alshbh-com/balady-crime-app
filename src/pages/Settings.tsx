import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, Lock } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (password === "01278006248") {
      localStorage.setItem("admin-auth", "true");
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/admin");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
    setPassword("");
  };

  return (
    <div className="min-h-screen pb-20 gradient-warm">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">الإعدادات</h1>

        {/* Restaurant Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">معلومات المطعم</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">واتساب</p>
                <a href="tel:01025500588" className="font-bold hover:text-primary">
                  01025500588
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">موبايل</p>
                <a href="tel:01027262395" className="font-bold hover:text-primary">
                  01027262395
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">أرضي</p>
                <a href="tel:0132524448" className="font-bold hover:text-primary">
                  0132524448
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">العنوان</p>
                <p className="font-bold">جريمة بلدي - مصر</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Admin Login */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            لوحة التحكم
          </h2>
          
          {!showPasswordInput ? (
            <Button
              onClick={() => setShowPasswordInput(true)}
              className="w-full gradient-fire"
            >
              تسجيل الدخول كأدمن
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  placeholder="أدخل كلمة المرور"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdminLogin} className="flex-1 gradient-fire">
                  دخول
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Developer Info */}
        <Card className="p-4 text-center bg-muted">
          <p className="text-sm text-muted-foreground">
            المطور: <span className="font-bold text-foreground">𝘼𝙇𝙎𝙃𝘽𝙃</span>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
