/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/products/product';
import { ProductService } from 'src/app/products/product.service';
import { PantryService } from '../pantry.service';
import { AddProductToPantryComponent } from 'src/app/products/add-product-to-pantry/add-product-to-pantry.component';
import { PantryItem } from '../pantryItem';
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
  public pantryProducts: PantryItem[] = [];
  public filteredProducts: Product[];

  public name: string;

  public activeFilters: boolean;

  popup = false;

  getUnfilteredProductsSub: Subscription;

  public tempId: string;
  public tempDialog: any;
  public tempDeleted: Product;

  public bakingSuppliesProducts: Product[];
  public bakedGoodsProducts: Product[];
  public deliProducts: Product[];
  public cleaningProducts: Product[];
  public petSuppliesProducts: Product[];
  public produceProducts: Product[];
  public meatProducts: Product[];
  public dairyProducts: Product[];
  public frozenProducts: Product[];
  public paperProducts: Product[];
  public beverageProducts: Product[];
  public herbProducts: Product[];
  public stapleProducts: Product[];
  public toiletriesProducts: Product[];
  public miscellaneousProducts: Product[];

  i: number;
  j: number;
  category: string;
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
  getPantryItemsFromServer() {
    this.pantryService.getPantryItems().subscribe(returnedPantryProducts => {

      this.pantryProducts = returnedPantryProducts;
      this.lengthItems = this.pantryProducts.length;
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of products in your pantry; the server might be down');
      this.snackBar.open(
        'Problem contacting the server - try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });

    });
  }

  getUnfilteredProducts(): void {
    this.unsubUnfiltered();
    this.getUnfilteredProductsSub = this.productService.getProducts().subscribe(returnedProducts => {
      this.allProducts = returnedProducts;
      this.lengthAllProducts = this.allProducts.length;
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

  /*
  * Starts an asynchronous operation to update the pantry items list
  */
  ngOnInit(): void {
    this.getPantryItemsFromServer();
    this.getUnfilteredProducts();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  ngOnDestroy(): void {
    this.unsubUnfiltered();
  }

  unsubUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
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

}
