import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, BarChart3, Package, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Drop {
  id: string;
  title: string;
  description: string;
  stock: number;
  startTime: string;
  status: "live" | "upcoming" | "ended";
}

const mockDrops: Drop[] = [
  {
    id: "1",
    title: "Sınırlı Sayıda Spor Ayakkabı",
    description: "Sadece 100 çift ile özel renk",
    stock: 100,
    startTime: "2024-01-20T14:00:00Z",
    status: "live",
  },
  {
    id: "2",
    title: "VIP Konser Deneyimi",
    description: "Sahne arkası izinleri ve tanışma",
    stock: 50,
    startTime: "2024-01-22T18:00:00Z",
    status: "upcoming",
  },
];

export default function Admin() {
  const [drops, setDrops] = useState<Drop[]>(mockDrops);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDrop, setEditingDrop] = useState<Drop | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDrop: Drop = {
      id: editingDrop?.id || Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      stock: Number(formData.get("stock")),
      startTime: formData.get("startTime") as string,
      status: "upcoming",
    };

    if (editingDrop) {
      setDrops(drops.map((d) => (d.id === editingDrop.id ? newDrop : d)));
      toast.success("Kampanya başarıyla güncellendi!");
    } else {
      setDrops([...drops, newDrop]);
      toast.success("Kampanya başarıyla oluşturuldu!");
    }

    setIsDialogOpen(false);
    setEditingDrop(null);
  };

  const handleEdit = (drop: Drop) => {
    setEditingDrop(drop);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDrops(drops.filter((d) => d.id !== id));
    toast.success("Kampanya başarıyla silindi!");
  };

  const statusColors = {
    live: "bg-success text-white",
    upcoming: "bg-accent text-white",
    ended: "bg-muted text-muted-foreground",
  };

  const totalDrops = drops.length;
  const liveDrops = drops.filter(d => d.status === 'live').length;
  const totalStock = drops.reduce((sum, d) => sum + d.stock, 0);

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
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-display font-bold">Yönetim Paneli</h1>
              <p className="text-muted-foreground font-light">Lansmanları yönetin ve oluşturun</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow h-12 px-6 rounded-xl font-semibold"
                  onClick={() => setEditingDrop(null)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Yeni Lansman Ekle
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 border border-white/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">{editingDrop ? "Lansmanı Düzenleyin" : "Yeni Lansman Oluşturun"}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {editingDrop ? "Aşağıdaki kampanya detaylarını güncelleyin." : "Yeni kampanyanız için bilgileri doldurun."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5 py-4">
                   <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Başlık</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingDrop?.title}
                      placeholder="Lansman başlığı giriniz"
                      className="h-12 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Açıklama</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingDrop?.description}
                      placeholder="Detaylı açıklama giriniz"
                      rows={4}
                      className="rounded-xl border-2 focus:border-primary resize-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">Stok Miktarı</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      defaultValue={editingDrop?.stock}
                      placeholder="100"
                      min="1"
                      className="h-12 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-medium">Başlangıç Zamanı</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      defaultValue={editingDrop?.startTime.slice(0, 16)}
                      className="h-12 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow h-12 px-8 rounded-xl font-semibold">
                    {editingDrop ? "Değişiklikleri Kaydet" : "Lansmanı Oluştur"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="relative overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-3 shadow-glow">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-display font-bold mb-1">{totalDrops}</div>
              <div className="text-sm text-muted-foreground">Toplam Lansman</div>
            </div>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-accent p-3 shadow-accent">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-display font-bold mb-1">{liveDrops}</div>
              <div className="text-sm text-muted-foreground">Aktif Lansman</div>
            </div>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-success to-success/70 p-3 shadow-accent">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-display font-bold mb-1">{totalStock}</div>
              <div className="text-sm text-muted-foreground">Toplam Stok</div>
            </div>
          </Card>
        </div>

        <Card className="backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="font-semibold text-sm">Başlık</TableHead>
                  <TableHead className="font-semibold text-sm">Açıklama</TableHead>
                  <TableHead className="font-semibold text-sm">Stok</TableHead>
                  <TableHead className="font-semibold text-sm">Durum</TableHead>
                  <TableHead className="font-semibold text-sm">Başlangıç</TableHead>
                  <TableHead className="text-right font-semibold text-sm">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Henüz lansman bulunmuyor. Yeni bir lansman oluşturun.
                    </TableCell>
                  </TableRow>
                ) : (
                  drops.map((drop) => (
                    <TableRow key={drop.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium">{drop.title}</TableCell>
                      <TableCell className="max-w-md truncate text-muted-foreground">{drop.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{drop.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[drop.status]} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {drop.status === 'live' ? 'Canlı' : drop.status === 'upcoming' ? 'Yaklaşan' : 'Bitti'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(drop.startTime).toLocaleString('tr-TR', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(drop)}
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:border-primary transition-all"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(drop.id)}
                            className="h-9 w-9 rounded-xl hover:opacity-90 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
