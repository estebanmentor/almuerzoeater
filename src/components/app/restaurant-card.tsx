
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Restaurant } from "@/models/restaurant";

type RestaurantCardProps = {
  restaurant: Restaurant;
  onClick: () => void;
};

export function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  const { name, cuisine, imageUrl, imageHint, isNew } = restaurant;
  const tags = [cuisine, ...(isNew ? ['Nuevo'] : [])];

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          data-ai-hint={imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-xl font-headline mb-2">{name}</CardTitle>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <CardDescription>{cuisine}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button onClick={onClick} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
