import { CategoryState } from './category/category.model';
import { InspirationState } from './inspiration/inspiration.model';
import { LogState } from './log/log.model';
import { MaterialState } from './material/material.model';
import { ProductState } from './product/product.model';
import { QuestionState } from './question';

export interface AppState {
    category: CategoryState;
    product: ProductState;
    material: MaterialState;
    log: LogState;
    inspiration: InspirationState;
    question: QuestionState;
}
