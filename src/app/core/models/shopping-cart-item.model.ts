import { Product } from '@core/store/product/product.model';
import { User } from './user.model';

export interface BackendShoppingCartItem {
    product: Product;
    questions: any[];
    nameEmbroidery: string;
    comment: string;
    price: number;
    quantity: number;
}

export interface ShoppingCartItem {
    id: string;
    user: User;
    product: Product;
    questions: any[];
    nameEmbroidery: string;
    comment: string;
    price: number;
    quantity: number;
    updatedAt: Date;
    createdAt: Date;
}
