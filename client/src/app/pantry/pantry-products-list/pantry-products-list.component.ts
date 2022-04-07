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
  getUnfilteredItemsSub: Subscription;

  public tempId: string;
  public tempDialog: any;
  public tempDeleted: PantryItem;
  public tempName: string;

  public bakingSuppliesItems: PantryItem[] = [];
  public bakedGoodsItems: PantryItem[] = [];
  public deliItems: PantryItem[] = [];
  public cleaningItems: PantryItem[] = [];
  public petSuppliesItems: PantryItem[] = [];
  public produceItems: PantryItem[] = [];
  public meatItems: PantryItem[] = [];
  public dairyItems: PantryItem[] = [];
  public frozenItems: PantryItem[] = [];
  public paperItems: PantryItem[] = [];
  public beverageItems: PantryItem[] = [];
  public herbItems: PantryItem[] = [];
  public stapleItems: PantryItem[] = [];
  public toiletriesItems: PantryItem[] = [];
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

  /*
  * Starts an asynchronous operation to update the pantry items list
  */
  ngOnInit(): void {
    this.getPantryItemsFromServer();
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

  public makeCategoryLists(): void {
    this.bakedGoodsItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'baked goods'});
    this.produceItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'produce'});
    this.meatItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'meat'});
    this.dairyItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'dairy'});
    this.frozenItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'frozen foods'});
    this.herbItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'herbs and spices'});
    this.beverageItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'beverages'});
    this.cleaningItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'cleaning products'});
    this.paperItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'paper products'});
    this.miscellaneousItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'miscellaneous'});
    this.deliItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'deli'});
    this.stapleItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'staples'});
    this.toiletriesItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'toiletries'});
    this.bakingSuppliesItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'baking supplies'});
    this.petSuppliesItems = this.pantryService.filterItems(
      this.pantryProducts, { category: 'pet supplies'});
  }

  removeItem(id: string): PantryItem {
    this.pantryService.deleteItem(id).subscribe(
      item => {
        this.pantryProducts = this.pantryProducts.filter(pitem => pitem._id !== id);
        this.bakedGoodsItems = this.bakedGoodsItems.filter(pitem => pitem._id !== id);
        this.produceItems = this.produceItems.filter(pitem => pitem._id !== id);
        this.meatItems = this.meatItems.filter(pitem => pitem._id !== id);
        this.dairyItems = this.dairyItems.filter(pitem => pitem._id !== id);
        this.frozenItems = this.frozenItems.filter(pitem => pitem._id !== id);
        this.herbItems = this.herbItems.filter(pitem => pitem._id !== id);
        this.beverageItems = this.beverageItems.filter(pitem => pitem._id !== id);
        this.paperItems = this.paperItems.filter(pitem => pitem._id !== id);
        this.petSuppliesItems = this.petSuppliesItems.filter(pitem => pitem._id !== id);
        this.miscellaneousItems = this.miscellaneousItems.filter(pitem => pitem._id !== id);
        this.stapleItems = this.stapleItems.filter(pitem => pitem._id !== id);
        this.deliItems = this.deliItems.filter(pitem => pitem._id !== id);
        this.toiletriesItems = this.toiletriesItems.filter(pitem => pitem._id !== id);
        this.bakingSuppliesItems = this.bakingSuppliesItems.filter(pitem => pitem._id !== id);

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
