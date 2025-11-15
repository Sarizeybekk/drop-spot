import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (type: "login" | "signup", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(type === "login" ? "Başarıyla giriş yaptınız!" : "Hesap başarıyla oluşturuldu!");
      navigate("/drops");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,hsl(217_100%_98%),hsl(199_100%_97%),hsl(210_100%_99%))]" />
      
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1920&auto=format&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 4c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }} />
      
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      
      <Navbar />
      
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 relative z-10">
        <Card className="w-full max-w-md p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 rounded-3xl">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex rounded-2xl bg-gradient-primary p-3 shadow-glow">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="mb-3 text-3xl font-display font-bold">DropSpot'a Hoş Geldiniz</h1>
            <p className="text-muted-foreground font-light text-sm">
              Özel lansmanlara erişim için giriş yapın veya üyelik oluşturun
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Giriş</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Üyelik</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={(e) => handleAuth("login", e)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">E-posta Adresi</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    className="h-12 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Şifre</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Şifrenizi giriniz"
                    className="h-12 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow h-12 rounded-xl font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yapın"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={(e) => handleAuth("signup", e)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">E-posta</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="ornek@mail.com"
                    className="h-12 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Şifre</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Minimum 6 karakter"
                    className="h-12 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow h-12 rounded-xl font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            Devam ederek Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul ediyorsunuz
          </div>
        </Card>
      </main>
    </div>
  );
}
