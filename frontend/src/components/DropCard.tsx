import { Clock, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DropCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  stock: number;
  waitlistCount: number;
  startTime: string;
  status: "live" | "upcoming" | "ended";
}

export const DropCard = ({
  id,
  title,
  description,
  image,
  stock,
  waitlistCount,
  startTime,
  status,
}: DropCardProps) => {
  const statusConfig = {
    live: { color: "bg-success", text: "Canlı", variant: "default" as const },
    upcoming: { color: "bg-accent", text: "Yakında", variant: "secondary" as const },
    ended: { color: "bg-muted", text: "Bitti", variant: "outline" as const },
  };

  const config = statusConfig[status];

  return (
    <Card className="group overflow-hidden glassmorphism hover-glow transition-all duration-500 hover:scale-[1.02]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4">
          <Badge className={`${config.color} text-white shadow-lg backdrop-blur-sm px-4 py-1.5 text-xs font-semibold rounded-full`}>
            {config.text}
          </Badge>
        </div>
        {status === "live" && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 rounded-full glassmorphism-dark px-4 py-2 shadow-glow">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-white">Aktif</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-xl font-display font-bold tracking-tight">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>

        <div className="mb-6 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{waitlistCount} bekliyor</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="font-medium">{stock} kota</span>
          </div>
        </div>

        <Button variant={config.variant} className={`w-full font-semibold rounded-xl h-11 transition-all ${status === 'live' ? 'bg-gradient-primary hover:opacity-90 shadow-elegant' : ''}`} asChild>
          <Link to={`/drop/${id}`}>
            {status === "live" ? "Hemen Talep Edin" : status === "upcoming" ? "Listeye Kayıt Olun" : "Detayları İnceleyin"}
          </Link>
        </Button>
      </div>
    </Card>
  );
};
