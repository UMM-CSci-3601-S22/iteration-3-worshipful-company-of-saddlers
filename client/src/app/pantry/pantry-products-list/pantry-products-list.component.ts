/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
import { ProductService } from 'src/app/products/product.service';
import { PantryService } from '../pantry.service';
import { MatDialog } from '@angular/material/dialog';
import { PantryItem } from '../pantryItem';

@Component({
  selector: 'app-pantry-products-list',
  templateUrl: './pantry-products-list.component.html',
  styleUrls: ['./pantry-products-list.component.scss']
})
export class PantryProductsListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;
  // Unfiltered product list
  public allProducts: Product[];
  public pantryProducts: Product[];
  public filteredProducts: Product[];
  public productToAdd: PantryItem;

  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;

  public activeFilters: boolean;
  public tempId: string;
  public tempName: string;
  public tempDialog: any;

  getUnfilteredProductsSub: Subscription;



  /**
   * This constructor injects both an instance of `PantryService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param pantryService the `PantryService` used to get products in the pantry
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private pantryService: PantryService, private productService: ProductService,
     private snackBar: MatSnackBar, public dialog: MatDialog) {
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

  openAddDialog(pname: string, id: string): void {
    this.tempId = id;
    this.tempName = pname;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: {name: this.tempName, _id: this.tempId} }, );
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  /*
  * Starts an asynchronous operation to update the users list
  */
  ngOnInit(): void {
    this.getPantryItemsFromServer();
    this.getUnfilteredProducts();
  }

  ngOnDestroy(): void {
    this.unsubUnfiltered();
  }

  unsubUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
    }
  }
}
