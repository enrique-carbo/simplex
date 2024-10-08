import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"

// Images 
import HoodieImage from '@/assets/images/products/hoodie.jpg';
import WhiteTShirt from '@/assets/images/products/white-t-shirt.jpg';
import WhiteTShirt1 from '@/assets/images/products/white-t-shirt-1.jpg';
import MorralGris from '@/assets/images/products/morral-gris.jpg'
import MorralNegro from '@/assets/images/products/morral-negro.jpg'
import RemeraBatikAzul from '@/assets/images/products/remera-batik.jpg'
import RemeraBatikVerde from '@/assets/images/products/remara-batik-verde.jpg'
import RemeraAlgodoneraAzul from '@/assets/images/products/remera-algodonera-azul.jpg'

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
    image: RemeraAlgodoneraAzul,
    alt: 'Remera'
  },
  {
    image: MorralNegro,
    alt: 'Producto 5'
  },
  {
    image: RemeraBatikVerde,
    alt: 'Producto 6'
  },
  {
    image: RemeraBatikAzul,
    alt: 'Producto 7'
  }
];


export function CarouselOfertas() {
  
  return (
    <div className='flex justify-center p-4'>
      <Carousel className="w-full max-w-lg md:max-w-4xl" 
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}>
        
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