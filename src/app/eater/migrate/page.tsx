
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { migrateDatabase, type MigrateDatabaseOutput } from "@/ai/flows/migrate-db-flow";
import { Loader2, Database, AlertTriangle, CheckCircle } from "lucide-react";

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrateDatabaseOutput | null>(null);
  const { toast } = useToast();

  const handleMigration = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await migrateDatabase();
      setResult(response);
      toast({
        variant: response.success ? "default" : "destructive",
        title: response.success ? "¡Migración Exitosa!" : "Error en la Migración",
        description: response.message,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ocurrió un error inesperado durante la migración.";
      setResult({ success: false, message: errorMessage, collections: [] });
      toast({
        variant: "destructive",
        title: "Error Crítico",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-8">
      <PageHeader
        title="Migración de Base de Datos"
        description="Carga los datos de prueba iniciales a tu base de datos de Firestore."
      />

      <Card>
        <CardHeader>
          <CardTitle>Poblar Base de Datos</CardTitle>
          <CardDescription>
            Haz clic en el botón de abajo para iniciar el proceso. Esto llenará
            todas las colecciones necesarias (restaurantes, contactos, etc.) con
            datos ficticios para que la aplicación funcione correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 border-l-4 border-destructive bg-destructive/10 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-destructive">
                            Acción Importante
                        </h3>
                        <div className="mt-2 text-sm text-destructive/80">
                            <p>
                                Este proceso puede sobreescribir datos existentes. Se recomienda
                                ejecutarlo solo una vez en una base de datos vacía.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleMigration} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Database className="mr-2 h-5 w-5" />
            )}
            {loading ? "Migrando..." : "Iniciar Migración de Datos"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {result.success ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-destructive" />}
                    Resultado de la Migración
                </CardTitle>
                <CardDescription>
                    {result.success ? "El proceso finalizó correctamente." : "El proceso encontró un error."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className={`text-sm p-4 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'}`}>
                    {result.message}
                </p>
                {result.collections.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-semibold">Resumen de la Migración:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {result.collections.map(col => (
                                <li key={col.name}>
                                    <strong>{col.name}:</strong> {col.documents} documento(s) procesado(s).
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
