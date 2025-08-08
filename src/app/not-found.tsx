import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SearchX } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <div className="mx-auto w-full max-w-xl text-center">
            <PageHeader title="Página No Encontrada" />
            <Card className="mt-8">
                <CardHeader>
                     <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <SearchX className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Error 404</CardTitle>
                    <CardDescription>
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/">Volver al Inicio</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
