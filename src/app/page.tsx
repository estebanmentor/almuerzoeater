
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Logo } from "@/components/app/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo className="h-6 w-6 text-primary" />
          <span className="sr-only">almuerzo.cl</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full h-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                 <div className="flex justify-center items-center gap-4">
                    <Logo className="h-16 w-16 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                        almuerzo.cl
                    </h1>
                </div>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  Tu asistente amigable para organizar almuerzos, descubrir restaurantes y obtener recomendaciones con IA. ¡Nunca más almuerces solo!
                </p>
              </div>
              <div className="w-full max-w-xl mx-auto">
                <div className="grid grid-cols-1 gap-4">
                  <Button asChild size="lg">
                    <Link href="/eater/dashboard">
                      <Users className="mr-2" />
                      Entrar a la App
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">&copy; 2024 almuerzo.cl. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
