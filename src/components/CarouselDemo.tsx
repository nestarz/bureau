import { Card, CardContent } from "@/src/components/ui/card.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel.tsx";

import type { UseClient } from "@/src/lib/useClient.ts";
const useClient: UseClient = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: UseClient["h"] = useClient.h;
export const hydrate: UseClient["hydrate"] = useClient.hydrate;

export const CarouselDemo = () => {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
