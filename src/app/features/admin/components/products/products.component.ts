import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { selectAllProducts } from '@core/store';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@UntilDestroy()
@Component({
  selector: 'mhd-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
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
      map((products) => [...products]),
      untilDestroyed(this)
    );
  }

  onAddProduct(): void {
    this.dialog.open(AddProductComponent, {
      minWidth: '40vw'
    });
  }

  onEditProduct(product: Product): void {
    this.dialog.open(EditProductComponent, {
      minWidth: '40vw',
      data: product
    });
  }

  onDeleteProduct(product: Product): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          message: `Biztos törölni szeretnéd "${product.name}" terméket?`
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.productService.deleteProduct$(product)),
        tap(() => {
          this.toastr.success(`${product.name} termék törölve`);
        })
      )
      .subscribe();
  }

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }

  applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;
    table.filterGlobal(filter, stringVal);
  }
}
