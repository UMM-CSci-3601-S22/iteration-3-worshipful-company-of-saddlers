/* eslint-disable @typescript-eslint/naming-convention */
import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Product, ProductCategory, categories, categoryCamelCase } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';

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

  public categoriesList: ProductCategory[] = [
    'baked goods',
    'baking supplies',
    'beverages',
    'cleaning products',
    'dairy',
    'deli',
    'frozen foods',
    'herbs and spices',
    'meat',
    'miscellaneous',
    'paper products',
    'pet supplies',
    'produce',
    'staples',
    'toiletries',
  ];

  // Category collections for use in deleting products
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

  public categoryNameMap = new Map<ProductCategory, Product[]>();

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
    categories.forEach((cat: ProductCategory) => {
      const categoryAsField = categoryCamelCase(cat);
      this[categoryAsField] = this.productService.filterProducts(
        this.allProducts, { category: cat }
      );
    });
  }

  getProductsFromServer(): void {
    this.unsub();
    this.getProductsSub = this.productService.getProducts({
      category: this.productCategory,
      store: this.productStore
    }).subscribe(returnedProducts => {
      this.serverFilteredProducts = returnedProducts;
      this.initializeCategoryMap();
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

  // Sorts products based on their category
  initializeCategoryMap() {
    // eslint-disable-next-line prefer-const
    for (let givenCategory of this.categoriesList) {
      this.categoryNameMap.set(givenCategory,
        this.productService.filterProducts(this.serverFilteredProducts, { category: givenCategory }));

    }
    console.log(this.categoryNameMap);
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
          const categoryAsField = categoryCamelCase(prod.category);
          this[categoryAsField] = this[categoryAsField].filter(product => product._id !== id);
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
