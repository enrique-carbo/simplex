import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Productos',
      links: [
        {
          text: 'Remeras',
          href: getPermalink('/homes/remeras'),
        },
        {
          text: 'Buzos',
          href: getPermalink('/homes/buzos'),
        },        
        {
          text: 'Pantalones',
          href: getPermalink('/homes/pantalones'),
        },
        {
          text: 'Bags',
          href: getPermalink('/homes/bags'),
        },
        {
          text: 'Accesorios',
          href: getPermalink('/homes/accesorios')
        },
        {
          text: 'Ofertas',
          href: getPermalink('/homes/ofertas')
        }
      ],
    },
    {
      text: 'Nosotros',
      links: [
        {
          text: 'Origen',
          href: getPermalink('/about'),
        },
        { text: 'Ubicación',
          href: getPermalink('/location')
        },
        {
          text: 'Contacto',
          href: getPermalink('/contact'),
        }
      ],
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Artículos',
          href: getBlogPermalink(),
        },
        {
          text: 'Remeras de Algodón',
          href: getPermalink('remera-algodon-tipos', 'post'),
        },
        {
          text: 'Textiles',
          href: getPermalink('textiles', 'category'),
        },
        {
          text: 'Suplementos',
          href: getPermalink('suplementos', 'category'),
        }
      ],
    }
  ]
};

export const footerData = {
  links: [
    {
      title: 'Productos',
      links: [
        { text: 'Remeras', href: '/homes/remeras' },
        { text: 'Buzos', href: '/homes/buzos' },
        { text: 'Pantalones', href: '/homes/pantalones' },
        { text: 'Bags', href: '/homes/bags' },
        { text: 'Accesorios', href: '/homes/accesorios' },
        { text: 'OFERTAS', href: '/homes/ofertas' },
      ],
    },
    {
      title: 'Nosotros',
      links: [
        { text: 'Origen', href: '/about' },
        { text: 'Ubicación', href: '/location' },
        { text: 'Contacto', href: '/contact' }
      ]
    },
    {
      title: 'Legales',
      links: [
        { text: 'Términos y Condiciones', href: '/terms' },
        { text: 'Políticas de Privacidad', href: '/privacy' },
        { text: 'Cambios y Devoluciones', href: '/cambios' }
      ],
    },
  ],
  socialLinks: [
    { ariaLabel: 'TikTok', icon: 'tabler:brand-tiktok', href: 'https://www.tiktok.com/@simplex.ar' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/simplex.parana/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') }
  ],
  footNote: `
    Padre Grella 1593. WhatsApp 3434 718183
  `,
};
