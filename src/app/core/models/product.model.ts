import { Category } from './category.model';

// export interface BuiltProduct {
//   baseMaterials: {
//     baseProduct: string;
//     baseColor: string;
//     szundikendoColor?: string;
//     minkyColorBack?: string;
//     earsColor?: string;
//     earsAndBodyColor?: string;
//     noseColor?: string;
//     ribbonColor?: string;
//   };
//   extraOptions: {
//     extraMinkyEarsCheckbox?: boolean;
//     extraMinkyEarsInput?: string;
//     nameEmbroideryCheckbox?: boolean;
//     nameEmbroideryInput?: string;
//     productComment?: string;
//   };
//   price: number;
// }

export interface Product {
  _id?: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  category?: Category;
  price: number;
  stock: number;
}
