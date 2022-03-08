/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  // Unfiltered product list
  public allProducts: Product[];

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;
  getProductsSub: Subscription;
  getUnfilteredProductsSub: Subscription;

  // Boolean for if there are active filters
  public activeFilters: boolean;

  // Category collections for use in displaying product categories
  public bakeryProducts: Product[];
  public produceProducts: Product[];
  public meatProducts: Product[];
  public dairyProducts: Product[];
  public frozenProducts: Product[];
  public cannedProducts: Product[];
  public drinkProducts: Product[];
  public generalProducts: Product[];
  public seasonalProducts: Product[];
  public miscellaneousProducts: Product[];

  constructor(private productService: ProductService, private snackBar: MatSnackBar) { }

  getUnfilteredProducts(): void {
    this.unsubUnfiltered();
    this.getUnfilteredProductsSub = this.productService.getProducts().subscribe(returnedProducts => {
      this.allProducts = returnedProducts;
      this.makeCategoryLists();
    });
  }

  public makeCategoryLists(): void {
    this.bakeryProducts = this.productService.filterProducts(
      this.allProducts, { category: 'bakery'});
    this.produceProducts = this.productService.filterProducts(
      this.allProducts, { category: 'produce'});
    this.meatProducts = this.productService.filterProducts(
      this.allProducts, { category: 'meat'});
    this.dairyProducts = this.productService.filterProducts(
      this.allProducts, { category: 'dairy'});
    this.frozenProducts = this.productService.filterProducts(
      this.allProducts, { category: 'frozen foods'});
    this.cannedProducts = this.productService.filterProducts(
      this.allProducts, { category: 'canned goods'});
    this.drinkProducts = this.productService.filterProducts(
      this.allProducts, { category: 'drinks'});
    this.generalProducts = this.productService.filterProducts(
      this.allProducts, { category: 'general grocery'});
    this.seasonalProducts = this.productService.filterProducts(
      this.allProducts, { category: 'seasonal'});
    this.miscellaneousProducts = this.productService.filterProducts(
      this.allProducts, { category: 'miscellaneous'});
  }
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
    if (this.productCategory || this.name || this.productBrand || this.productStore) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  public updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.serverFilteredProducts, { product_name: this.name, brand: this.productBrand , limit: this.productLimit });

  }



  ngOnInit(): void {
    this.getProductsFromServer();
    this.getUnfilteredProducts();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

  unsubUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
    }
  }

  removeProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.allProducts = this.allProducts.filter(product => product._id !== id);
     }
    );
    this.snackBar.open('Failed to add the user', 'OK', {
      duration: 5000,
    });
  }

}
