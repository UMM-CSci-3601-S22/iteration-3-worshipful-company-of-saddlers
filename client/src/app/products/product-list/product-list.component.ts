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
  public bakingSuppliesProducts: Product[] = [];
  public bakedGoodsProducts: Product[] = [];
  public deliProducts: Product[] = [];
  public cleaningProducts: Product[] = [];
  public petSuppliesProducts: Product[] = [];
  public produceProducts: Product[] = [];
  public meatProducts: Product[] = [];
  public dairyProducts: Product[] = [];
  public frozenProducts: Product[] = [];
  public paperProducts: Product[] = [];
  public beverageProducts: Product[] = [];
  public herbProducts: Product[] = [];
  public stapleProducts: Product[] = [];
  public toiletriesProducts: Product[] = [];
  public miscellaneousProducts: Product[] = [];

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
    this.bakedGoodsProducts = this.productService.filterProducts(
      this.allProducts, { category: 'baked goods'});
    this.produceProducts = this.productService.filterProducts(
      this.allProducts, { category: 'produce'});
    this.meatProducts = this.productService.filterProducts(
      this.allProducts, { category: 'meat'});
    this.dairyProducts = this.productService.filterProducts(
      this.allProducts, { category: 'dairy'});
    this.frozenProducts = this.productService.filterProducts(
      this.allProducts, { category: 'frozen foods'});
    this.herbProducts = this.productService.filterProducts(
      this.allProducts, { category: 'herbs and spices'});
    this.beverageProducts = this.productService.filterProducts(
      this.allProducts, { category: 'beverages'});
    this.cleaningProducts = this.productService.filterProducts(
      this.allProducts, { category: 'cleaning products'});
    this.paperProducts = this.productService.filterProducts(
      this.allProducts, { category: 'paper products'});
    this.miscellaneousProducts = this.productService.filterProducts(
      this.allProducts, { category: 'miscellaneous'});
    this.deliProducts = this.productService.filterProducts(
      this.allProducts, { category: 'deli'});
    this.stapleProducts = this.productService.filterProducts(
      this.allProducts, { category: 'staples'});
    this.toiletriesProducts = this.productService.filterProducts(
      this.allProducts, { category: 'toiletries'});
    this.bakingSuppliesProducts = this.productService.filterProducts(
      this.allProducts, { category: 'baking supplies'});
    this.petSuppliesProducts = this.productService.filterProducts(
      this.allProducts, { category: 'pet supplies'});
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
        this.bakedGoodsProducts = this.bakedGoodsProducts.filter(product => product._id !== id);
        this.produceProducts = this.produceProducts.filter(product => product._id !== id);
        this.meatProducts = this.meatProducts.filter(product => product._id !== id);
        this.dairyProducts = this.dairyProducts.filter(product => product._id !== id);
        this.frozenProducts = this.frozenProducts.filter(product => product._id !== id);
        this.herbProducts = this.herbProducts.filter(product => product._id !== id);
        this.beverageProducts = this.beverageProducts.filter(product => product._id !== id);
        this.paperProducts = this.paperProducts.filter(product => product._id !== id);
        this.petSuppliesProducts = this.petSuppliesProducts.filter(product => product._id !== id);
        this.miscellaneousProducts = this.miscellaneousProducts.filter(product => product._id !== id);
        this.stapleProducts = this.stapleProducts.filter(product => product._id !== id);
        this.deliProducts = this.deliProducts.filter(product => product._id !== id);
        this.toiletriesProducts = this.toiletriesProducts.filter(product => product._id !== id);
        this.bakingSuppliesProducts = this.bakingSuppliesProducts.filter(product => product._id !== id);

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
