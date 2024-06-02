import { Injectable, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { CategoryAction } from '../category';
import { ProductAction } from './product.actions';

@Injectable()
export class ProductEffects {
    private readonly actions$ = inject(Actions);
    private readonly productService = inject(ProductService);
    private readonly toastr = inject(ToastrService);
    private readonly store = inject(Store);

    addProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductAction.addProduct),
            exhaustMap(({ product }) =>
                this.productService.addProduct$(product).pipe(
                    map((addedProduct) => {
                        this.toastr.success(`${addedProduct.name} termék hozzáadva.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return ProductAction.addProductSuccess({ product: addedProduct });
                    })
                )
            )
        )
    );

    updateProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductAction.updateProduct),
            exhaustMap(({ product }) =>
                this.productService.updateProduct$(product).pipe(
                    map((updatedProduct) => {
                        this.toastr.success(`${updatedProduct.name} termék frissítve.`);
                        return ProductAction.updateProductSuccess({ product: updatedProduct });
                    })
                )
            )
        )
    );

    deleteProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductAction.deleteProduct),
            exhaustMap(({ id, name }) =>
                this.productService.deleteProduct$(id).pipe(
                    map(() => {
                        this.toastr.success(`${name} termék törölve.`);
                        return ProductAction.deleteProductSuccess({ id });
                    })
                )
            )
        )
    );

    getProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductAction.getProducts),
            exhaustMap(() =>
                this.productService
                    .getProducts$()
                    .pipe(map((products) => ProductAction.getProductsSuccess({ products })))
            )
        )
    );
}
