import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

// Images 
import HoodieImage from '@/assets/images/products/hoodie.jpg';
import WhiteTShirt from '@/assets/images/products/white-t-shirt.jpg';
import WhiteTShirt1 from '@/assets/images/products/white-t-shirt-1.jpg';


export function CarouselPlugin() {
  
  return (
    <div className='flex justify-center'>
      <Carousel className="w-full max-w-md">
        <CarouselContent>
          
          <CarouselItem>
            <Card className='p-1'>
              <CardContent className="flex aspect-square items-center justify-center p-6">
              <img src={HoodieImage.src} alt="Producto 1"
              className="object-cover w-full h-full"/>
              </CardContent>
            </Card>
           </CarouselItem>

          <CarouselItem>
            <Card className='p-1'>
              <CardContent className="flex aspect-square items-center justify-center p-6">
              <img src={WhiteTShirt.src} alt="Producto 2"
              className="object-cover w-full h-full"/>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className='p-1'>
              <CardContent className="flex aspect-square items-center justify-center p-6">
              <img src={WhiteTShirt1.src} alt="Producto 3"
              className="object-cover w-full h-full"/>
              </CardContent>
            </Card>
          </CarouselItem>
        
        </CarouselContent>
        <CarouselPrevious className="hidden md:block"/>
        <CarouselNext className="hidden md:block"/>
      </Carousel>
    </div>
  );
}