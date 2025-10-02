import { Dialog } from "@radix-ui/react-dialog";
import { Building, ChevronDown, LogOut } from "lucide-react";

import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/supabaseClient";

type AccountMenuProps = {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
};

export function AccountMenu({
  displayName,
  email,
  avatarUrl,
}: AccountMenuProps) {
  const shownName = displayName || "Usuário";
  const initials = shownName.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = `${import.meta.env.BASE_URL}register`;
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} alt={shownName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="max-w-[140px] truncate">{shownName}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={shownName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{shownName}</span>
              {email && (
                <span className="text-muted-foreground text-sm font-normal truncate">
                  {email}
                </span>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* <DialogTrigger asChild>
            <DropdownMenuItem>
              <Building className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
          </DialogTrigger> */}

          <DropdownMenuItem
            asChild
            className="text-rose-500 dark:text-rose-400"
          >
            <button className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
