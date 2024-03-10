export interface BackendReview {
    product: string;
    rating: number;
    description: string;
}

export interface Review {
    id: string;
    product: string;
    user: string;
    rating: number;
    description: string;
    updatedAt: Date;
    createdAt: Date;
}
