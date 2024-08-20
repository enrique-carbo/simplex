import React from'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';


type CarouselItemProps = {
  index: number;
  image: string;
};

const CarouselItemComponent: React.FC<CarouselItemProps> = ({ index, image }) => (
  <div className="p-1">
    <Card>
      <CardContent className="flex aspect-square items-center justify-center p-6">
        <img src={`./src/assets/images/products/${image}`} alt={`Imagen ${index + 1}`} 
        className="object-cover w-full h-full"/>
      </CardContent>
    </Card>
  </div>
);

export function CarouselPlugin() {
  const images = ['hoodie.jpg', 'white-t-shirt.jpg', 'white-t-shirt-1.jpg'];
  

  return (
    <div className='flex justify-center'>
      <Carousel className="w-full max-w-md">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <CarouselItemComponent index={index} image={image} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:block"/>
        <CarouselNext className="hidden md:block"/>
      </Carousel>
    </div>
  );
}