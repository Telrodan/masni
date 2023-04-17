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
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  startWith,
  tap
} from 'rxjs';

interface ProductsData {
  products: Product[];
  categories: Category[];
}

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  product: Product;
  productForm: FormGroup;
  productsData$: Observable<ProductsData>;
  isDialogVisible = false;
  categoryForm: FormGroup;

  constructor(
    private store: Store,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      category: new FormControl(null)
    });

    this.productsData$ = combineLatest([
      this.store.select(productsSelector),
      this.store.select(categoriesSelector),
      this.categoryForm.valueChanges.pipe(
        startWith({ category: 'all' }),
        debounceTime(300)
      )
    ]).pipe(
      map(([products, categories, category]) => {
        let filteredProducts: Product[] = [];

        if (category.category === 'all') {
          filteredProducts = products;
        } else {
          filteredProducts = products.filter(
            (product) => product.categoryId === category.category
          );
        }

        return {
          products: filteredProducts,
          categories: [{ categoryName: 'Összes', _id: 'all' }, ...categories]
        };
      })
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
    if (this.productForm.valid) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.productForm.value
      };

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
