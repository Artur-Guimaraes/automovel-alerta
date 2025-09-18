import { Dialog } from '@radix-ui/react-dialog'
import { Building, ChevronDown, LogOut } from 'lucide-react'

import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AccountMenu() {

   return (
      <Dialog>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="outline"
                  className="flex select-none items-center gap-2"
               >
                  Usuário Logado
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel className="flex flex-col">      
                  <span>Nome Perfil</span>
                  <span className="text-muted-foreground text-sm font-normal">
                      Email Perfil
                  </span>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DialogTrigger asChild>
                  <DropdownMenuItem>
                     <Building className="mr-2 h-4 w-4" />
                     <span>Perfil</span>
                  </DropdownMenuItem>
               </DialogTrigger>
               <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400">
                  <button className='w-full'>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Sair</span>
                  </button>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </Dialog>
   )
}
