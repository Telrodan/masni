import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { selectAllProducts } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';
import { capitalize } from 'src/app/shared/util/first-letter-capital';
import { ToastrService } from '@core/services/toastr.service';

@UntilDestroy()
@Component({
  selector: 'mhd-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('table') productsTable: Table;

  products$: Observable<Product[]>;

  images: string[];
  imageLoadedStatus: boolean[] = [];

  constructor(
    private store$: Store,
    private productService: ProductService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.products$ = this.store$.select(selectAllProducts).pipe(
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

  onDeleteProduct(product: Product): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd 
          "${capitalize(product.name)}"
           terméket?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.productService.deleteProduct$(product)),
        tap(() => {
          this.toastr.success(`${capitalize(product.name)} termék törölve`);
        })
      )
      .subscribe();
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
