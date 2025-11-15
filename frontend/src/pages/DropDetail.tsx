import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function DropDetail() {
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // Mock data - will be replaced with API call
  const drop = {
    id: "1",
    title: "Sınırlı Sayıda Spor Ayakkabı",
    description: "Dünya genelinde sadece 100 çift bulunan özel renk. Tam tahıl deri, hafızalı köpük iç taban ve güçlendirilmiş dikiş içeren premium malzemeler. Her çift orijinallik sertifikası ile gelir.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    stock: 100,
    claimed: 67,
    waitlistCount: 234,
    startTime: "2024-01-20T14:00:00Z",
    endTime: "2024-01-20T20:00:00Z",
    status: "live" as const,
    features: [
      "Premium tam tahıl deri",
      "Hafızalı köpük iç taban",
      "Güçlendirilmiş dikiş",
      "Orijinallik sertifikası",
      "100 çift ile sınırlı",
    ],
  };

  const handleJoinWaitlist = () => {
    setIsJoined(true);
    toast.success("İşlem Başarılı", {
      description: "Bekleme listesine kaydınız alınmıştır.",
    });
  };

  const handleLeaveWaitlist = () => {
    setIsJoined(false);
    toast.info("Bekleme listesinden çıkarıldınız");
  };

  const handleClaim = () => {
    setIsClaimed(true);
    toast.success("İşlem Tamamlandı", {
      description: "Talep kodunuz: DROP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });
  };

  const progressPercentage = (drop.claimed / drop.stock) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/drops">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Lansmanlara Geri Dön
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-elegant">
              <img
                src={drop.image}
                alt={drop.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-success text-white">Canlı</Badge>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Özellikler</h3>
              <ul className="space-y-2">
                {drop.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-4xl font-bold">{drop.title}</h1>
              <p className="text-lg text-muted-foreground">{drop.description}</p>
            </div>

            <Card className="p-6">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Durum</span>
                  <span className="text-sm text-muted-foreground">
                    {drop.claimed} / {drop.stock} talep edildi
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listede Bekleyen</p>
                    <p className="text-xl font-bold">{drop.waitlistCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="rounded-full bg-accent/10 p-2">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Stok</p>
                    <p className="text-xl font-bold">{drop.stock}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-center gap-2 text-accent">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span className="font-semibold">Aktif Lansman Dönemi</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {isClaimed ? (
                  <div className="rounded-lg border border-success bg-success/5 p-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
                    <p className="font-semibold text-success">Talebiniz Alınmıştır</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Talep kodunuz e-posta adresinize iletilmiştir
                    </p>
                  </div>
                ) : isJoined ? (
                  <>
                    <Button
                      onClick={handleClaim}
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                    >
                      Hemen Talep Edin
                    </Button>
                    <Button
                      onClick={handleLeaveWaitlist}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Listeden Çıkın
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleJoinWaitlist}
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="lg"
                  >
                    Listeye Kayıt Olun
                  </Button>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Kayıt olarak hizmet şartlarımızı kabul etmiş olursunuz
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
