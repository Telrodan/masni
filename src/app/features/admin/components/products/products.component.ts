import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { getCategories, selectAllProducts } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { filter, map, Observable, tap } from 'rxjs';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

@UntilDestroy()
@Component({
  selector: 'mhd-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('table') productsTable: Table;

  products$: Observable<Product[]>;

  product: Product;
  productForm: FormGroup;
  isDialogVisible = false;
  categoryForm: FormGroup;

  images: string[];
  imageLoadedStatus: boolean[] = [];

  matchModeOptions: SelectItem[];

  constructor(
    private store: Store,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.products$ = this.store.select(selectAllProducts).pipe(
      filter((products) => !!products),
      map((products) => {
        this.reloadProductsImages(products);

        return [...products];
      }),
      untilDestroyed(this)
    );
  }

  ngAfterViewInit(): void {
    this.productsTable.onSort
      .pipe(
        tap(() => {
          if (this.productsTable.filteredValue) {
            this.reloadProductsImages(this.productsTable.filteredValue);
          } else {
            this.reloadProductsImages(this.productsTable.value);
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onAddProduct(): void {
    this.dialog.open(AddProductComponent, {
      minWidth: '40vw',
      maxHeight: '90vh'
    });
  }

  onEditProduct(product: Product): void {
    this.dialog.open(EditProductComponent, {
      minWidth: '40vw',
      maxHeight: '90vh',
      data: product
    });
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

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }

  applyFilterGlobal($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;

    table.filterGlobal(filter, stringVal);
    if (filter !== '' && table.filteredValue) {
      this.reloadProductsImages(table.filteredValue);
    } else {
      this.reloadProductsImages(table.value);
    }
  }

  reloadProductsImages(products: Product[]) {
    this.images = products.map((product) => {
      const timestamp = new Date().getTime();

      return product.images[0] + `?timestamp=${timestamp}`;
    });
    this.imageLoadedStatus = this.images.map(() => false);
  }
}
