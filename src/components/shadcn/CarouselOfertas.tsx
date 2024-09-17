import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"

// Images 
import HoodieImage from '@/assets/images/products/hoodie.jpg';
import WhiteTShirt from '@/assets/images/products/white-t-shirt.jpg';
import WhiteTShirt1 from '@/assets/images/products/white-t-shirt-1.jpg';
import MorralGris from '@/assets/images/products/morral-gris.jpg'
import MorralNegro from '@/assets/images/products/morral-negro.jpg'
import RemeraGris from '@/assets/images/products/remera-gris.jpg'


const carouselItems = [
  {
    image: HoodieImage,
    alt: 'Producto 1'
  },
  {
    image: WhiteTShirt,
    alt: 'Producto 2'
  },
  {
    image: WhiteTShirt1,
    alt: 'Producto 3'
  },
  {
    image: MorralGris,
    alt: 'Producto 4'
  },
  {
    image: MorralNegro,
    alt: 'Producto 5'
  },
  {
    image: RemeraGris,
    alt: 'Producto 6'
  }
];


export function CarouselOfertas() {
  
  return (
    <div className='flex justify-center'>
      <Carousel className="w-full max-w-md md:max-w-3xl" 
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}>
        
        <CarouselContent>
          
        {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
              <Card className='p-1'>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={item.image.src} alt={item.alt} className="object-cover w-full h-full"/>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        
        </CarouselContent>
        <CarouselPrevious className="hidden md:block"/>
        <CarouselNext className="hidden md:block"/>
      </Carousel>
    </div>
  );
}