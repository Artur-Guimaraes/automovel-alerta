import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@/supabaseClient";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ícone Google (inline, sem libs extras)
  function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.2-1.7 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C16.9 2.6 14.7 1.6 12 1.6 6.9 1.6 2.8 5.7 2.8 10.8S6.9 20 12 20c5.7 0 9.5-4 9.5-9.6 0-.6-.1-1-.2-1.5H12z"
        />
      </svg>
    );
  }

  // Se já estiver logado, manda pra Home
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (data.session) navigate("/app", { replace: true });
      });
  }, [navigate]);

  async function handleGoogleLogin() {
    try {
      setLoading(true);

      const base = import.meta.env.BASE_URL || "/";
      const redirectTo = `${window.location.origin}${base}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;

      // O Supabase redireciona; não navegamos manualmente aqui.
      toast("Redirecionando para o Google…", {
        description: "Aguarde um instante.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Falha ao iniciar o login", {
        description: err?.message ?? "Tente novamente em alguns segundos.",
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo + título */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="inline-flex items-center justify-center rounded-2xl h-12 w-12 bg-primary/10 text-primary">
            <CarFront className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Entrar</h1>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para gerenciar seus veículos
            </p>
          </div>
        </div>

        <Card className="border rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Escolha seu método de login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl"
            >
              <GoogleIcon className="h-5 w-5" />
              {loading ? "Redirecionando..." : "Entrar com Google"}
            </Button>

            {/* Dica/termos */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Ao continuar, você concorda com nossos termos e política.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
