import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Indumentaria',
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
          text: 'Cordura',
          href: getPermalink('cordura-dupont', 'post'),
        },
        {
          text: 'Remeras de Algodón',
          href: getPermalink('remera-algodon-tipos', 'post'),
        },
        {
          text: 'Textiles',
          href: getPermalink('textiles', 'category'),
        }
      ],
    }
  ]
};

export const footerData = {
  links: [
    {
      title: 'Indumentaria',
      links: [
        { text: 'Remeras', href: '/homes/remeras' },
        { text: 'Buzos', href: '/homes/buzos' },
        { text: 'Pantalones', href: '/homes/pantalones' },
        { text: 'Bags', href: '/homes/bags' },
        { text: 'Accesorios', href: '/homes/accesorios' },
      ],
    },
    {
      title: 'Nosotros',
      links: [
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
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') }
  ],
  footNote: `
    Visitanos en Padre Grella 1515. Paraná. Entre Ríos
  `,
};
