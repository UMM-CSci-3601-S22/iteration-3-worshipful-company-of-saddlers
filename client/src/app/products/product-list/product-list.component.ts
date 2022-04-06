/* eslint-disable @typescript-eslint/naming-convention */
import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-component',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: []
})

export class ProductListComponent implements OnInit, OnDestroy {
  // MatDialog
  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

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

  // temp variables to use for deletion
  public tempId: string;
  public tempName: string;
  public tempDialog: any;
  public tempDeleted: Product;
  constructor(private productService: ProductService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  openDeleteDialog(pname: string, id: string) {
    this.tempId = id;
    this.tempName = pname;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: {name: this.tempName, _id: this.tempId} }, );
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

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
    if (this.productCategory || this.productStore) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  public updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.serverFilteredProducts, { product_name: this.name, brand: this.productBrand , limit: this.productLimit });
      if (this.name || this.productBrand || this.productCategory || this.productStore) {
        this.activeFilters = true;
      }
      else {
        this.activeFilters = false;
      }

  }



  ngOnInit(): void {
    this.getProductsFromServer();
    this.getUnfilteredProducts();
  }

  ngOnDestroy(): void {
    this.unsub();
    this.unsubUnfiltered();
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

  removeProduct(id: string): Product {
    this.productService.deleteProduct(id).subscribe(
      prod => {
        this.allProducts = this.allProducts.filter(product => product._id !== id);
        this.filteredProducts = this.filteredProducts.filter(product => product._id !== id);
        this.serverFilteredProducts = this.filteredProducts.filter(product => product._id !== id);
        this.bakeryProducts = this.bakeryProducts.filter(product => product._id !== id);
        this.produceProducts = this.produceProducts.filter(product => product._id !== id);
        this.meatProducts = this.meatProducts.filter(product => product._id !== id);
        this.dairyProducts = this.dairyProducts.filter(product => product._id !== id);
        this.frozenProducts = this.frozenProducts.filter(product => product._id !== id);
        this.cannedProducts = this.cannedProducts.filter(product => product._id !== id);
        this.drinkProducts = this.drinkProducts.filter(product => product._id !== id);
        this.generalProducts = this.generalProducts.filter(product => product._id !== id);
        this.seasonalProducts = this.seasonalProducts.filter(product => product._id !== id);
        this.miscellaneousProducts = this.miscellaneousProducts.filter(product => product._id !== id);
        this.tempDeleted = prod;
     }
    );
    this.tempDialog.close();
    this.snackBar.open('Product deleted', 'OK', {
      duration: 5000,
    });
    return this.tempDeleted;
  }

}
