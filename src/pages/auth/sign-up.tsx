import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUp() {
  return (
    <>
       <div className='flex min-h-screen items-center justify-center p-8'>
         <div className='absolute right-8 top-8'>
          <ThemeToggle />
         </div>

          <div className='w-[350px] flex flex-col justify-center gap-6'>
             <div className='flex flex-col gap-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Criar conta</h1>
                <p className='text-sm text-muted-foreground'>Tenha as manutenções do seu veículo sob controle!</p>
             </div>

             <form className='space-y-4' >
                <div className='space-y-2'>
                   <Label htmlFor='email'>Usuário</Label>
                   <Input
                      id='restaurantName'
                      type='text'
                   />
                </div>

                <div className='space-y-2'>
                   <Label htmlFor='email'>Seu nome</Label>
                   <Input
                      id='managerName'
                      type='text'
                   />
                </div>

                <div className='space-y-2'>
                   <Label htmlFor='email'>Seu e-mail</Label>
                   <Input
                      id='email'
                      type='email'
                   />
                </div>

                <div className='space-y-2'>
                   <Label htmlFor='email'>Seu telefone</Label>
                   <Input
                      id='phone'
                      type='tel'
                   />
                </div>

                <Button className='w-full' type='submit'>Finalizar cadastro</Button>

                <p className='px-6 text-center text-sm leading-relaxed text-muted-foreground'>
                   Ao continuar, você concorda com nossos
                   <a className='underline underline-offset-4 text-primary'> {' '} termos de serviço</a>
                   {' '} e {' '}
                   <a className='underline underline-offset-4 text-primary'>políticas de privacidade</a>.
                </p>
             </form>
          </div>
       </div>
    </>
 )
}