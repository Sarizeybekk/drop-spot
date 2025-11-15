import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Clock, Shield, TrendingUp } from "lucide-react";

const Index = () => {
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
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-32 text-center">
          <div className="animate-fade-in">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 px-6 py-3 shadow-lg">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">Özel Erişim Platformu</span>
            </div>
            
            <h1 className="mb-8 text-6xl font-display font-bold leading-tight md:text-8xl animate-slide-up">
              Sınırlı Sayıda Fırsatlar.
              <br />
              <span className="text-gradient animate-gradient">
                Erken Erişim Avantajı.
              </span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl font-light leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Sınırlı stoktaki premium ürün ve deneyimlere özel erişim hakkı kazanın. 
              Şeffaf öncelik sistemi ile adil dağıtım. Anlık bildirim sistemi.
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow text-base font-semibold px-8 h-14 rounded-xl" asChild>
                <Link to="/drops">Fırsatları Keşfedin</Link>
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-white/20 hover-glow text-base font-semibold px-8 h-14 rounded-xl" asChild>
                <Link to="/auth">Hemen Başlayın</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border border-white/20 p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-primary p-4 shadow-glow">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-display font-bold">Anlık Bildirim Sistemi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yeni sınırlı stok lansmanları gerçekleştiğinde anında bildirim alın. Tüm fırsatlardan haberdar olun.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border border-white/20 p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-accent p-4 shadow-accent">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-display font-bold">Şeffaf Öncelik Sistemi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Adil ve şeffaf sıralama algoritması. Katılım zamanı ve aktivite bazlı eşit fırsat dağılımı.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border border-white/20 p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-success to-success/70 p-4 shadow-accent">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-display font-bold">Premium Erişim Hakkı</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sınırlı stoktaki ürünlere, VIP deneyimlere ve özel etkinliklere erken erişim fırsatı.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-16 text-center text-primary-foreground shadow-elegant">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0yaDJ2Mmg<MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-display font-bold md:text-5xl">
                Premium erişim için hazır mısınız?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl opacity-95 font-light leading-relaxed">
                Hesabınızı oluşturun ve sınırlı stoktaki özel fırsatlara erişim hakkı kazanın.
              </p>
              <Button size="lg" variant="secondary" className="glassmorphism-dark hover-glow text-base font-semibold px-10 h-14 rounded-xl" asChild>
                <Link to="/auth">Üye Olun</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-white/10">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-sm text-muted-foreground font-light tracking-wide">
            © 2025 DropSpot. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
