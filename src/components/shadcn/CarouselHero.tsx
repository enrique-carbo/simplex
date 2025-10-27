import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"

// Images 
import WhiteTShirt from '@/assets/images/products/white-t-shirt.jpg'
import WhiteTShirt1 from '@/assets/images/products/white-t-shirt-1.jpg'
import SimplexModel from '@/assets/images/products/model-sign-1.webp'
import MaleModel from '@/assets/images/products/male-model.webp'
import Grella1593 from '@/assets/images/grella1593.jpg'
import HorarioPrimavera2025 from '@/assets/images/horarioPrimavera2025.jpg';

const carouselItems = [
  {
    image: Grella1593,
    alt: 'Ubicacion Grella 1593'
  },
  {
    image: HorarioPrimavera2025,
    alt: 'Horario primavera 2025'
  },
  {
    image: SimplexModel,
    alt: 'Simplex model'
  },
  {
    image: MaleModel,
    alt: 'Male model'
  },
  {
    image: WhiteTShirt,
    alt: 'Remera Blanca'
  },
  {
    image: WhiteTShirt1,
    alt: 'Remera Blanca 1'
  }
];


export function CarouselHero() {
  
  return (
    <div className='flex justify-center'>
      <Carousel className="w-full max-w-md" 
      plugins={[
        Autoplay({
          delay: 3000
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}>
        
        <CarouselContent>
          
        {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
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