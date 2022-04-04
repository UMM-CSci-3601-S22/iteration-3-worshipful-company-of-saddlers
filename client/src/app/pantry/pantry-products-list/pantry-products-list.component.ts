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

  public bakeryItems: PantryItem[] = [];
  public produceItems: PantryItem[] = [];
  public meatItems: PantryItem[] = [];
  public dairyItems: PantryItem[] = [];
  public frozenItems: PantryItem[] = [];
  public cannedItems: PantryItem[] = [];
  public drinkItems: PantryItem[] = [];
  public generalItems: PantryItem[] = [];
  public seasonalItems: PantryItem[] = [];
  public miscellaneousItems: PantryItem[] = [];

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

    this.lengthItems = this.pantryProducts.length;

    console.error(this.lengthItems);
  }

  getUnfilteredProducts(): void {
    this.unsubUnfiltered();
    this.getUnfilteredProductsSub = this.productService.getProducts().subscribe(returnedProducts => {
      this.allProducts = returnedProducts;
    });

    this.lengthAllProducts = this.allProducts.length;
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
    this.intoCategories();
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

  // removeProduct(id: string): Product {
  //   this.pantryService.deleteItem(id).subscribe(
  //     item => {
  //       this.pantryProducts = this.pantryProducts.filter(product => product._id !== id);
  //       this.filteredProducts = this.filteredProducts.filter(product => product._id !== id);
  //       this.pantryProducts = this.filteredProducts.filter(product => product._id !== id);
  //       this.bakeryItems = this.bakeryItems.filter(product => product._id !== id);
  //       this.produceItems = this.produceItems.filter(product => product._id !== id);
  //       this.meatItems = this.meatItems.filter(product => product._id !== id);
  //       this.dairyItems = this.dairyItems.filter(product => product._id !== id);
  //       this.frozenItems = this.frozenItems.filter(product => product._id !== id);
  //       this.cannedItems = this.cannedItems.filter(product => product._id !== id);
  //       this.drinkItems = this.drinkItems.filter(product => product._id !== id);
  //       this.generalItems = this.generalItems.filter(product => product._id !== id);
  //       this.seasonalItems = this.seasonalItems.filter(product => product._id !== id);
  //       this.miscellaneousItems = this.miscellaneousItems.filter(product => product._id !== id);
  //       this.tempDeleted = item;
  //    }
  //   );
  //   this.tempDialog.close();
  //   this.snackBar.open('Pantry Item deleted', 'OK', {
  //     duration: 5000,
  //   });
  //   return this.tempDeleted;
  // }


  // Counts the number of a given item in the pantry.
  // countItems(id: string): number {
  //   for (this.i = 0; this.i < this.lengthAllProducts; this.i++) {
  //     if (this.pantryProducts[this.i].product === id) {
  //       this.count++;
  //     }
  //   }
  //   return this.count;
  // }

  // Iterates through the array of pantryItems, and finds the product with the
  // matching id, and then puts the pantryItem into the correct category array.
  intoCategories(): void {
    for (this.i = 0; this.i < this.lengthItems; this.i++) {
      for (this.j = 0; this.j < this.lengthAllProducts; this.j++) {
        if (this.pantryProducts[this.i].product === this.allProducts[this.j]._id) {
          this.category = this.allProducts[this.j].category;
          this.correctCategory(this.pantryProducts[this.i], this.category);
        }
      }
    }
  }

  // Helper function that puts a pantryItem into the correct category array.
  correctCategory(pantryItem: PantryItem, category: string): void {
    if (category === 'bakery') {
      this.bakeryItems.push(pantryItem);
    }
    if (category === 'produce') {
      this.produceItems.push(pantryItem);
    }
    if (category === 'meat') {
      this.meatItems.push(pantryItem);
    }
    if (category === 'dairy') {
      this.dairyItems.push(pantryItem);
    }
    if (category === 'frozen') {
      this.frozenItems.push(pantryItem);
    }
    if (category === 'canned') {
      this.cannedItems.push(pantryItem);
    }
    if (category === 'drink') {
      this.drinkItems.push(pantryItem);
    }
    if (category === 'general') {
      this.generalItems.push(pantryItem);
    }
    if (category === 'seasonal') {
      this.seasonalItems.push(pantryItem);
    }
    if (category === 'miscellaneous') {
      this.miscellaneousItems.push(pantryItem);
    }
  }

}
