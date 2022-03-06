import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list-component',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: []
})

export class ProductListComponent implements OnInit, OnDestroy {
  public serverFilteredProducts: Product[];
  public filteredProducts: Product[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  getProductsSub: Subscription;

  // MatPaginator Inputs
  public productListLength: number;
  public pageSize: 10;
  public pageSizeOptions: number[] = [5, 10, 25, 50];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private productService: ProductService) { }

  getProductsFromServer(): void {
    this.unsub();
    this.getProductsSub = this.productService.getProducts({
      category: this.productCategory,
      store: this.productStore
    }).subscribe(returnedProducts => {
      this.serverFilteredProducts = returnedProducts;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.serverFilteredProducts, { productName: this.name, brand: this.productBrand });
    this.productListLength = this.filteredProducts.length;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {
    this.getProductsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

}
