import { Car, CarFront, HomeIcon, Wrench } from 'lucide-react';
import { Separator } from './ui/separator';
import { ThemeToggle } from './theme/theme-toggle';
import { AccountMenu } from './account-menu';
import { NavLink } from 'react-router';

export function Header() {
  return (
    <div className='border-b'>
      <div className='flex h-20 items-center px-6'>

        <div className='flex items-center gap-10'>

          <CarFront className='w-6 h-6' />
          <Separator orientation='vertical' className='h-6' />

          <nav className='flex items-center space-x-8 lg:space-x-10'>

            <NavLink to="/" className='flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'>
                <HomeIcon className='h-4 w-4' />
                Início
              </NavLink>

            <NavLink to="/vehicles" className='flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'>
                <Car className='h-4 w-4' />
                Meus Veículos
            </NavLink>

            <NavLink to="/maintenance" className='flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'>
                <Wrench className='h-4 w-4' />
                Manutenções
            </NavLink>            
          </nav>

        </div>


        <div className='ml-auto flex items-center gap-2'>
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
