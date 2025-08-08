
"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Send, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SuggestRestaurantPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Archivo no válido",
          description: "Por favor, sube solo archivos de imagen.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('restaurant-name') as string;
    const address = formData.get('restaurant-address') as string;
    const comments = formData.get('comments') as string;

    if (!name.trim() && !address.trim() && !comments.trim()) {
        toast({
            variant: "destructive",
            title: "Información Incompleta",
            description: "Por favor, rellena al menos el nombre, la dirección o un comentario.",
        });
        return;
    }

    toast({
        title: "¡Gracias por tu aporte!",
        description: "Hemos recibido tu sugerencia y la revisaremos pronto.",
    });
    
    setImagePreview(null);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sugerir un Restaurante u Oferta"
        description="¡Gracias por ayudarnos a crecer! Tu aporte es muy valioso."
      />

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
            <Card>
            <CardHeader>
                <CardTitle>Completa la Información</CardTitle>
                <CardDescription>
                Llena los campos a continuación para enviar tu sugerencia. No es
                necesario que completes todo si no tienes la información.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label className="font-semibold">
                    ¿Qué quieres sugerir?
                </Label>
                <RadioGroup defaultValue="new-restaurant" name="suggestion-type" className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new-restaurant" id="r1" />
                    <Label htmlFor="r1">Un nuevo restaurante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new-offer" id="r2" />
                    <Label htmlFor="r2">Una oferta o descuento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="correction" id="r3" />
                    <Label htmlFor="r3">Corregir información</Label>
                    </div>
                </RadioGroup>
                </div>
                <div className="space-y-2">
                <Label htmlFor="restaurant-name">Nombre del Restaurante</Label>
                <Input
                    id="restaurant-name"
                    name="restaurant-name"
                    placeholder="Ej: El Rincón del Sabor"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="restaurant-address">Dirección del Restaurante</Label>
                <Input
                    id="restaurant-address"
                    name="restaurant-address"
                    placeholder="Ej: Av. Siempreviva 742, Santiago"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="comments">
                    Comentarios Adicionales
                </Label>
                <Textarea
                    id="comments"
                    name="comments"
                    placeholder="Describe la oferta, el plato que recomiendas, la corrección que necesitas o cualquier otro detalle útil aquí."
                />
                <p className="text-xs text-muted-foreground">
                    Si es una oferta, intenta incluir detalles como el descuento, días válidos y en qué aplica.
                </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="photo-upload">Adjuntar una Fotografía (Opcional)</Label>
                    <div className="flex items-center gap-4">
                        <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <Label htmlFor="photo-upload" className="flex-grow">
                            <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('photo-upload')?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Subir Imagen
                            </Button>
                        </Label>
                        {imagePreview && (
                            <div className="relative shrink-0">
                                <Image src={imagePreview} alt="Vista previa" width={80} height={80} className="h-20 w-20 rounded-md object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={() => setImagePreview(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Una foto de la fachada, el menú o el plato nos ayuda a verificar la información más rápido.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="mr-2 h-4 w-4" />
                Enviar Sugerencia
                </Button>
            </CardFooter>
            </Card>
        </form>
      </div>
    </div>
  );
}
