/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
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
  public allProducts: Product[];
  public pantryProducts: PantryItem[];
  public filteredProducts: Product[];

  public name: string;

  public activeFilters: boolean;

  popup = false;

  getUnfilteredProductsSub: Subscription;

  public tempId: string;
  public tempDialog: any;
  public tempDeleted: Product;

  public bakeryItems: PantryItem[];
  public produceItems: PantryItem[];
  public meatItems: PantryItem[];
  public dairyItems: PantryItem[];
  public frozenItems: PantryItem[];
  public cannedItems: PantryItem[];
  public drinkItems: PantryItem[];
  public generalItems: PantryItem[];
  public seasonalItems: PantryItem[];
  public miscellaneousItems: PantryItem[];


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
    });
  }

  updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.allProducts, { product_name: this.name }
    );
    if( this.name ) {
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
    this.tempDialog = this.dialog.open(this.dialogRef, { data: {_id: this.tempId} }, );
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  public makeCategoryLists(): void {
    this.bakeryItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'bakery'});
    this.produceItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'produce'});
    this.meatItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'meat'});
    this.dairyItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'dairy'});
    this.frozenItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'frozen foods'});
    this.cannedItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'canned goods'});
    this.drinkItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'drinks'});
    this.generalItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'general grocery'});
    this.seasonalItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'seasonal'});
    this.miscellaneousItems = this.pantryService.filterPantryItems(
      this.pantryProducts, { category: 'miscellaneous'});
  }

  removeProduct(id: string): Product {
    this.pantryService.deleteItem(id).subscribe(
      item => {
        this.pantryProducts = this.pantryProducts.filter(product => product._id !== id);
        this.filteredProducts = this.filteredProducts.filter(product => product._id !== id);
        this.pantryProducts = this.filteredProducts.filter(product => product._id !== id);
        this.bakeryItems = this.bakeryItems.filter(product => product._id !== id);
        this.produceItems = this.produceItems.filter(product => product._id !== id);
        this.meatItems = this.meatItems.filter(product => product._id !== id);
        this.dairyItems = this.dairyItems.filter(product => product._id !== id);
        this.frozenItems = this.frozenItems.filter(product => product._id !== id);
        this.cannedItems = this.cannedItems.filter(product => product._id !== id);
        this.drinkItems = this.drinkItems.filter(product => product._id !== id);
        this.generalItems = this.generalItems.filter(product => product._id !== id);
        this.seasonalItems = this.seasonalItems.filter(product => product._id !== id);
        this.miscellaneousItems = this.miscellaneousItems.filter(product => product._id !== id);
        this.tempDeleted = item;
     }
    );
    this.tempDialog.close();
    this.snackBar.open('Pantry Item deleted', 'OK', {
      duration: 5000,
    });
    return this.tempDeleted;
  }


}
