export const PRODUCT_CATEGORIES = [
  {
    label: 'Sofas & Seating',
    value: 'sofa_and_seating' as const,
    featured: [
      {
        name: 'Sofas',
        href: `/products?category=sofa_and_seating`,
        subCategories: [
          {
            name: 'L-Shape Sofa',
            href: `/products?category=sofa_and_seating&subcategory=l_shape_sofa`,
          },
          {
            name: '3 Seat Sofa',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_sofa`,
          },
          {
            name: '2 Seat Sofa',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_sofa`,
          },
          {
            name: '1 Seat Sofa',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_sofa`,
          },
        ]
      },
      {
        name: 'Recliners',
        href: '/products?category=sofa_and_seating&subcategory=recliners',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Sofa Cum Beds',
        href: '/products?category=sofa_and_seating&subcategory=sofa_cum_bed',
        subCategories: []
      },
      {
        name: 'Bean Bags',
        href: `/products?category=sofa_and_seating&subcategory=bean_bag`,
        subCategories: []
      },
      {
        name: 'New Arrivals',
        href: '/products?category=sofa_and_seating&sort=desc',
        subCategories: []
      },
    ],
    categoryImgSrc: '/nav/sofa/sofa-img.png'
  },
  {
    label: 'Mattresses',
    value: 'mattresses' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
    ],
    categoryImgSrc: '/nav/mattress/mattress-img.png'
  },
  {
    label: 'Home Decor',
    value: 'home_decor' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
    ],
    categoryImgSrc: '/nav/homeDecor/home-decor.png'
  },
  {
    label: 'Furnishings',
    value: 'furnishings' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
    ],
    categoryImgSrc: '/nav/furnishing/furnishing.png'
  },
  {
    label: 'Lamps & Lights',
    value: 'mattresses' as const,
    featured: [
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Favorite Icon Picks',
        href: `/products?category=icons`,
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'New Arrivals',
        href: '/products?category=icons&sort=desc',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
      {
        name: 'Bestselling Icons',
        href: '/products?category=icons',
        subCategories: [
          {
            name: '3 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=3_seat_recliner`,
          },
          {
            name: '2 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=2_seat_recliner`,
          },
          {
            name: '1 Seat Recliner',
            href: `/products?category=sofa_and_seating&subcategory=1_seat_recliner`,
          },
        ]
      },
    ],
    categoryImgSrc: '/nav/lights/lights.png'
  },
]
