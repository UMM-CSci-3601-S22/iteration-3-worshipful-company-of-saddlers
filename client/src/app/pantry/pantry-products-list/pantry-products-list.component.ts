/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product, ProductCategory, categories, categoryCamelCase } from 'src/app/products/product';
import { ProductService } from 'src/app/products/product.service';
import { PantryService } from '../pantry.service';
import { PantryItem } from '../pantryItem';
import { PantryProduct } from '../pantryProduct';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pantry-products-list',
  templateUrl: './pantry-products-list.component.html',
  styleUrls: ['./pantry-products-list.component.scss']
})
export class PantryProductsListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  @Input() product: Product;

  // Unfiltered product list
  public allProducts: Product[] = [];
  public pantryProducts: PantryProduct[] = [];
  public serverFilteredPantryProducts: PantryProduct[];
  public filteredPantryProducts: PantryProduct[] = [];
  public filteredProducts: Product[];

  public name: string;
  public productCategory: ProductCategory;

  public activeFilters: boolean;

  popup = false;

  getUnfilteredProductsSub: Subscription;
  getItemsSub: Subscription;
  getUnfilteredItemsSub: Subscription;

  public tempId: string;
  public tempDialog: any;
  public tempDeleted: PantryItem;
  public tempName: string;
  public ItemName: string;

  public bakingSuppliesItems: PantryProduct[] = [];
  public bakedGoodsItems: PantryProduct[] = [];
  public deliItems: PantryProduct[] = [];
  public cleaningItems: PantryProduct[] = [];
  public petSuppliesItems: PantryProduct[] = [];
  public produceItems: PantryProduct[] = [];
  public meatItems: PantryProduct[] = [];
  public dairyItems: PantryProduct[] = [];
  public frozenItems: PantryProduct[] = [];
  public paperItems: PantryProduct[] = [];
  public beverageItems: PantryProduct[] = [];
  public herbItems: PantryProduct[] = [];
  public stapleItems: PantryProduct[] = [];
  public toiletriesItems: PantryProduct[] = [];
  public miscellaneousItems: PantryProduct[] = [];

  i: number;
  j: number;
  lengthAllProducts: number;
  lengthItems: number;

  count: number;


  /**
   * This constructor injects both an instance of `PantryService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param pantryService the `PantryService` used to get products in the pantry
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private pantryService: PantryService, private productService: ProductService,
    private snackBar: MatSnackBar, private router: Router, public dialog: MatDialog) {
    // Nothing here – everything is in the injection parameters.
  }

  /*
  * Get the products in the pantry from the server,
  */
  // getItemsFromServer() {
  //   this.pantryService.getPantryItems().subscribe(returnedPantryProducts => {

  //     this.pantryProducts = returnedPantryProducts;
  //     this.lengthItems = this.pantryProducts.length;
  //   }, err => {
  //     // If there was an error getting the users, log
  //     // the problem and display a message.
  //     console.error('We couldn\'t get the list of products in your pantry; the server might be down');
  //     this.snackBar.open(
  //       'Problem contacting the server - try again',
  //       'OK',
  //       // The message will disappear after 3 seconds.
  //       { duration: 3000 });

  //   });
  // }

  getItemsFromServer(): void {
    this.unsub();
    this.getItemsSub = this.pantryService.getPantryItems({
      category: this.productCategory,
      name: this.ItemName
    }).subscribe(returnedItems => {
      this.serverFilteredPantryProducts = returnedItems;
    }, err => {
      console.log(err);
    });
    if (this.productCategory || this.ItemName) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  getUnfilteredProducts(): void {
    this.unsubProductsUnfiltered();
    this.getUnfilteredProductsSub = this.productService.getProducts().subscribe(returnedProducts => {
      this.allProducts = returnedProducts;
      this.lengthAllProducts = this.allProducts.length;
    });
  }

  getUnfilteredItems(): void {
    this.unsubItemsUnfiltered();
    this.getUnfilteredItemsSub = this.pantryService.getPantryItems().subscribe(returnedItems => {
      this.pantryProducts = returnedItems;
      this.filteredPantryProducts = returnedItems;
      this.makeCategoryLists();
    });
  }

  updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.allProducts, { product_name: this.name }
    );
    if (this.name) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  updateItemFilter(): void {
    this.filteredPantryProducts = this.pantryService.filterPantryProducts(
      this.serverFilteredPantryProducts, {category: this.productCategory, name: this.ItemName}
    );
    if (this.ItemName || this.productCategory) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  /*
  * Starts an asynchronous operation to update the pantry items list
  */
  ngOnInit(): void {
    this.getItemsFromServer();
    this.getUnfilteredProducts();
    this.getUnfilteredItems();
  }

  reloadComponent() {
    const pantryPageUrl = '';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([pantryPageUrl]);
  }

  ngOnDestroy(): void {
    this.unsubProductsUnfiltered();
    this.unsubItemsUnfiltered();
    this.unsub();
  }

  unsubProductsUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
    }
  }

  unsubItemsUnfiltered(): void {
    if (this.getUnfilteredItemsSub) {
      this.getUnfilteredItemsSub.unsubscribe();
    }
  }

  openDeleteDialog(pname: string, id: string) {
    this.tempId = id;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: { _id: this.tempId } },);
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  unsub(): void {
    if (this.getItemsSub) {
      this.getItemsSub.unsubscribe();
    }
  }

  public makeCategoryLists(): void {
    categories.forEach((cat: ProductCategory) => {
      const categoryAsField = categoryCamelCase(cat);
      this[categoryAsField] = this.pantryService.filterPantryProducts(
        this.pantryProducts, { category: cat }
      );
    });
  }

  removeItem(id: string): PantryItem {
    this.pantryService.deleteItem(id).subscribe(
      item => {
        const categoryAsField = categoryCamelCase(item.category);
        this[categoryAsField] = this[categoryAsField].filter(pitem => pitem._id !== id);
        this.tempDeleted = item;
     }
    );
    this.tempDialog.close();
    this.snackBar.open('Product deleted', 'OK', {
      duration: 5000,
    });
    return this.tempDeleted;
  }

}
