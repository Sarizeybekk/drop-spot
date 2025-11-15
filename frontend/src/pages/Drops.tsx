import { Navbar } from "@/components/Navbar";
import { DropCard } from "@/components/DropCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with API calls
const mockDrops = [
  {
    id: "1",
    title: "Sınırlı Sayıda Spor Ayakkabı",
    description: "Dünya genelinde sadece 100 çift bulunan özel renk. Premium malzemeler ve benzersiz tasarım.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    stock: 100,
    waitlistCount: 234,
    startTime: "2024-01-20T14:00:00Z",
    status: "live" as const,
  },
  {
    id: "2",
    title: "VIP Konser Deneyimi",
    description: "Sahne arkası izinleri ve sanatçı ile tanışma fırsatı. Premium oturma dahil.",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80",
    stock: 50,
    waitlistCount: 892,
    startTime: "2024-01-22T18:00:00Z",
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "Tasarımcı Saat Koleksiyonu",
    description: "İsviçre mekanizmalı el yapımı. Dünya genelinde 75 adetle sınırlı.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    stock: 75,
    waitlistCount: 156,
    startTime: "2024-01-18T12:00:00Z",
    status: "ended" as const,
  },
  {
    id: "4",
    title: "Özel Sanat Baskısı",
    description: "Sanatçı tarafından imzalanmış ve numaralandırılmış. Arşiv kağıdına müze kalitesinde baskı.",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    stock: 200,
    waitlistCount: 421,
    startTime: "2024-01-25T10:00:00Z",
    status: "upcoming" as const,
  },
];

export default function Drops() {
  const [filter, setFilter] = useState<"all" | "live" | "upcoming" | "ended">("all");
  const [search, setSearch] = useState("");

  const filteredDrops = mockDrops.filter((drop) => {
    const matchesFilter = filter === "all" || drop.status === filter;
    const matchesSearch = drop.title.toLowerCase().includes(search.toLowerCase()) ||
                         drop.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Özel Lansmanlar</h1>
          <p className="text-lg text-muted-foreground">
            Sınırlı stok. Erken erişim avantajı.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="live">Canlı</TabsTrigger>
              <TabsTrigger value="upcoming">Yakında</TabsTrigger>
              <TabsTrigger value="ended">Bitti</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Lansmanlarda ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredDrops.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Arama kriterlerinize uygun lansman bulunamadı.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrops.map((drop) => (
              <DropCard key={drop.id} {...drop} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
