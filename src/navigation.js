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
        }
      ],
    },
    {
      text: 'Nosotros',
      links: [
        {
          text: 'Features (Anchor Link)',
          href: getPermalink('/#features'),
        },
        {
          text: 'Services',
          href: getPermalink('/services'),
        },
        {
          text: 'Pricing',
          href: getPermalink('/pricing'),
        },
        {
          text: 'About us',
          href: getPermalink('/about'),
        },
        {
          text: 'Contact',
          href: getPermalink('/contact'),
        },
        {
          text: 'Terms',
          href: getPermalink('/terms'),
        },
        {
          text: 'Privacy policy',
          href: getPermalink('/privacy'),
        },
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
          text: 'Category Page',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('astro', 'tag'),
        },
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
      ],
    },
    {
      title: 'Blog',
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
          text: 'Category Page',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('astro', 'tag'),
        },
      ],
    },
    {
      title: 'Nosotros',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    La elegancia de los Simplex.
  `,
};
