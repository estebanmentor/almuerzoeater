
"use client";

import type { CustomerPersona } from "@/models/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Camera, Baby, Utensils, Zap, User, Activity, Sparkles, Clock, Smartphone, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CustomerPersonaCardProps {
    persona: CustomerPersona;
    variant?: "restaurant" | "manager";
}

const iconMap = {
    Briefcase,
    Camera,
    Baby,
};

export function CustomerPersonaCard({ persona, variant = "restaurant" }: CustomerPersonaCardProps) {
    const Icon = iconMap[persona.icon as keyof typeof iconMap] || Utensils;

    if (variant === "manager") {
         return (
            <Card className="flex flex-col h-full border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                        </span>
                        {persona.name}
                    </CardTitle>
                    <CardDescription className="italic">"{persona.description}"</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end space-y-4">
                    <div className="space-y-3 text-sm">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-1"><Zap className="h-4 w-4 text-amber-500" />Motivaciones Clave</h4>
                            <p className="text-muted-foreground ml-6">{persona.motivations}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-1"><User className="h-4 w-4 text-blue-500" />Comportamiento</h4>
                            <p className="text-muted-foreground ml-6">{persona.painPoints}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-1"><Activity className="h-4 w-4 text-green-500" />Engagement</h4>
                            <p className="text-muted-foreground ml-6">{persona.engagement}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <h4 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-fuchsia-500" />Preferencias</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Gasto:</span>
                            <Badge variant="outline">{persona.preferences.spends}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Velocidad:</span>
                            <Badge variant="outline">{persona.preferences.speed}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Tipo de Pedido:</span>
                            <Badge variant="outline">{persona.preferences.ordering}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Icon className="h-7 w-7 text-primary" />
                    {persona.name}
                </CardTitle>
                <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/>Gasto:</span>
                        <Badge variant="outline">{persona.preferences.spends}</Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/>Velocidad:</span>
                        <Badge variant="outline">{persona.preferences.speed}</Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Smartphone className="h-4 w-4"/>Preferencia:</span>
                        <Badge variant="outline">{persona.preferences.ordering}</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
