import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignIn() {
  
   return (
      <>
         <div className='flex min-h-screen items-center justify-center p-8'>
            <div className='absolute right-8 top-8'>
              <ThemeToggle />
            </div>

            <div className='w-[350px] flex flex-col justify-center gap-6'>
               <div className='flex flex-col gap-2 text-center'>
                  <h1 className='text-2xl font-semibold tracking-tight'>Acessar painel</h1>
                  <p className='text-sm text-muted-foreground'>Acompanhe suas manutenções pelo painel</p>
               </div>

               <form className='space-y-4'>
                  <div className='space-y-2'>
                     <Label htmlFor='email'>Seu e-mail</Label>
                     <Input
                        id='email'
                        type='email'
                     />
                  </div>

                  <Button className='w-full' type='submit'>Acessar painel</Button>
               </form>
            </div>
         </div>
      </>
   )
}