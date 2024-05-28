import { Product } from '@core/store/product/product.model';

export interface ShopPageData {
    category: string;
    image: string;
    description?: string;
    products: Product[];
}
