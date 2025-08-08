"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí se podría registrar el error en un servicio de monitoreo (ej: Sentry, LogRocket)
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <div className="mx-auto w-full max-w-xl text-center">
            <PageHeader title="¡Oops! Algo salió mal" />
            <Card className="mt-8">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-4">Ha ocurrido un error inesperado</CardTitle>
                    <CardDescription>
                        Nuestro equipo ha sido notificado, pero puedes intentar recargar la página.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => reset()}>
                        Intentar de nuevo
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
