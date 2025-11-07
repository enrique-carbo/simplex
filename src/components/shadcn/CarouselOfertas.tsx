import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"

// Images 
import BuzoKimikal from '@/assets/images/products/buzo-kimikal.webp';
import BuzoKimikalGris from '@/assets/images/products/buzo-kimikal-gris.webp';
import MorralRed from '@/assets/images/products/morral-red.webp'
import RemeraBatikVerde from '@/assets/images/products/remara-batik-verde.jpg'
import RemeraAlgodoneraAzul from '@/assets/images/products/remera-algodonera-azul.jpg'
import MochilaEverlast from '@/assets/images/products/mochila-everlast-solapa.webp'
import RemeraLisaKimikal from '@/assets/images/products/remera-lisa-kimikal.webp'
import JeanLidase from '@/assets/images/products/jean-lidase.webp'
import SudaderaVerde from '@/assets/images/products/sudadera-verde.jpg'
import RemeraAzul from '@/assets/images/products/remera-azul-bermuda-beige.jpg'

const carouselItems = [
  {
    image: BuzoKimikal,
    alt: 'Campera frisa'
  },
  {
    image: MochilaEverlast,
    alt: 'Mochila Everlast'
  },
  {
    image: RemeraLisaKimikal,
    alt: 'Remera Lisa'
  },
  {
    image: JeanLidase,
    alt: 'Jean Lidase'
  },
  {
    image: RemeraAlgodoneraAzul,
    alt: 'Remera'
  },
  {
    image: MorralRed,
    alt: 'Morral'
  },
  {
    image: RemeraBatikVerde,
    alt: 'Remera Batik'
  },
  {    image: RemeraAzul,
    alt: 'Remera Azul'
  },  
  {
    image: SudaderaVerde,
    alt: 'Sudadera Verde'
  },
  {
    image: BuzoKimikalGris,
    alt: 'Buzo Kimikal Gris'
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