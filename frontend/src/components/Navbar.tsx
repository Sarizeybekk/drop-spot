import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-all hover:scale-105 hover-glow">
            <div className="rounded-xl bg-gradient-primary p-2.5 shadow-glow">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">DropSpot</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="font-medium hover:scale-105 transition-transform" asChild>
              <Link to="/drops">Lansmanlar</Link>
            </Button>
            <Button variant="ghost" className="font-medium hover:scale-105 transition-transform" asChild>
              <Link to="/admin">Yönetim Paneli</Link>
            </Button>
            <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 shadow-elegant hover-glow ml-2 px-6 h-11 rounded-xl font-semibold" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Giriş Yap</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
