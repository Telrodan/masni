import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import {
  categoriesSelector,
  getCategories,
  productsSelector
} from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { combineLatest, filter, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ProductsData {
  products: Product[];
  categories: Category[];
}

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {
  product: Product;
  productForm: FormGroup;
  productsData$: Observable<ProductsData>;
  productImagesUrl = environment.productImagesUrl;
  isDialogVisible = false;

  constructor(
    private store: Store,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.productsData$ = combineLatest([
      this.store.select(productsSelector),
      this.store.select(categoriesSelector)
    ]).pipe(
      filter(([products, categories]) => !!products && !!categories),
      map(([products, categories]) => ({
        products,
        categories
      }))
    );
  }

  onEditProduct(product: Product): void {
    if (product) {
      this.product = product;
      this.initForm(product);
    }
    this.isDialogVisible = true;
  }

  onUpdateProduct(): void {
    console.log(this.productForm.valid);
    if (this.productForm.valid) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.productForm.value
      };
      console.log(updatedProduct);
      this.productService
        .updateProduct$(updatedProduct)
        .pipe(
          tap((product) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: `${product.name} módosítva`
            });
            this.isDialogVisible = false;
          })
        )
        .subscribe();
    }
  }

  onDeleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Biztos törölni szeretnéd ${product.name} terméket?`,
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.productService
          .deleteProduct$(product)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: `${product.name} törölve`
              });
              this.store.dispatch(getCategories());
            })
          )
          .subscribe();
      }
    });
  }

  private initForm(product: Product): void {
    this.productForm = new FormGroup({
      categoryId: new FormControl(product.categoryId, Validators.required),
      name: new FormControl(product.name, Validators.required),
      shortDescription: new FormControl(
        product.shortDescription,
        Validators.required
      ),
      description: new FormControl(product.description, Validators.required),
      price: new FormControl(product.price, Validators.required),
      stock: new FormControl(product.stock, Validators.required)
    });
  }
}
