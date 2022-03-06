import { Component, OnInit, OnDestroy } from '@angular/core';
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
  public productLimit: number;
  getProductsSub: Subscription;

  // Category collections for use in displaying items
  public bakeryProducts: Product[];
  public produceProducts: Product[];
  public meatProducts: Product[];
  public dairyProducts: Product[];
  public frozenProducts: Product[];
  public cannedProducts: Product[];
  public drinkProducts: Product[];
  public seasonalProducts: Product[];
  public miscellaneousProducts: Product[];

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
      this.serverFilteredProducts, { productName: this.name, brand: this.productBrand , limit: this.productLimit });
    this.bakeryProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'bakery'});
    this.produceProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'produce'});
    this.meatProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'meat'});
    this.dairyProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'dairy'});
    this.frozenProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'frozen foods'});
    this.cannedProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'canned good'});
    this.drinkProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'drinks'});
    this.seasonalProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'seasonal'});
    this.miscellaneousProducts = this.productService.filterProducts(
      this.filteredProducts, { category: 'miscellaneous'});
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
