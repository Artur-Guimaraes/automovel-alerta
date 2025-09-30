import { useEffect, useState } from "react";
import { Car, CarFront, HomeIcon, Wrench, Fuel, Receipt } from "lucide-react";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from "./account-menu";
import { NavLink } from "react-router";

// Supabase
import { supabase } from "@/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

function getDisplayName(u?: User | null) {
  const meta = u?.user_metadata ?? {};
  return (
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    u?.email?.split("@")[0] ||
    "Usuário"
  );
}

function getAvatarUrl(u?: User | null) {
  const meta = u?.user_metadata ?? {};
  return meta.avatar_url || meta.picture || "";
}

export function Header() {
  //States de Auth -> supabase
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    // pega sessão atual (se já tem login feito)
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
    });

    // ouve mudanças de auth (login/logout/refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="border-b">
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-10">
          <CarFront className="w-6 h-6" />
          <Separator orientation="vertical" className="h-6" />

          <nav className="flex items-center space-x-8 lg:space-x-10">
            <NavLink
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <HomeIcon className="h-4 w-4" />
              Início
            </NavLink>

            <NavLink
              to="/vehicles"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Car className="h-4 w-4" />
              Meus Veículos
            </NavLink>

            <NavLink
              to="/maintenance"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Wrench className="h-4 w-4" />
              Manutenções
            </NavLink>

            <NavLink
              to="/refueling"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Fuel className="h-4 w-4" />
              Abastecimentos
            </NavLink>

            <NavLink
              to="/expenses"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Receipt className="h-4 w-4" />
              Gastos
            </NavLink>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <AccountMenu
            displayName={getDisplayName(user)}
            email={user?.email ?? ""}
            avatarUrl={getAvatarUrl(user)}
          />
        </div>
      </div>
    </div>
  );
}
