import {
  egyszinuPamutvaszon,
  mintasPamutvaszon,
  duplagez,
  minkyPluss
} from 'src/app/features/MATERIALS_DATA';

export const Nyuszko = {
  nev: 'Nyuszkó',
  alapszin: [...egyszinuPamutvaszon],
  fulek: [
    ...egyszinuPamutvaszon,
    ...mintasPamutvaszon,
    ...duplagez,
    ...minkyPluss
  ],
  masni: [
    'Rózsaszín szalag',
    'Fehér szalag',
    'Kék szalag',
    'Szürke szalag',
    'Bézs szalag',
    'Menta szalag'
  ],
  kepek: [
    '../../../../assets/images/featured-products/second.jpg',
    '../../../../assets/images/featured-products/third.jpg',
    '../../../../assets/images/featured-products/first.jpg',

    '../../../../assets/images/featured-products/second.jpg'
  ]
};
