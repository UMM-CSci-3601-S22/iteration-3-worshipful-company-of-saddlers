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
import { AddProductToPantryComponent } from 'src/app/products/add-product-to-pantry/add-product-to-pantry.component';

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
  public filteredPantryItems: PantryItem[];

  public name: string;
  public productCategory: ProductCategory;

  public activeFilters: boolean;

  popup = false;

  getUnfilteredProductsSub: Subscription;
  getItemsSub: Subscription;
  getUnfilteredItemsSub: Subscription;
  getUnfilteredDates: Subscription;

  public tempId: string;
  public tempDialog: any;
  public tempDeleted: PantryItem;
  public tempName: string;
  public tempDates: Date[] = [];
  public ItemName: string;

  public bakingSuppliesItems: PantryProduct[] = [];
  public bakedGoodsItems: PantryProduct[] = [];
  public deliItems: PantryProduct[] = [];
  public cleaningProductsItems: PantryProduct[] = [];
  public petSuppliesItems: PantryProduct[] = [];
  public produceItems: PantryProduct[] = [];
  public meatItems: PantryProduct[] = [];
  public dairyItems: PantryProduct[] = [];
  public frozenFoodsItems: PantryProduct[] = [];
  public paperProductsItems: PantryProduct[] = [];
  public beveragesItems: PantryProduct[] = [];
  public herbsAndSpicesItems: PantryProduct[] = [];
  public staplesItems: PantryProduct[] = [];
  public toiletriesItems: PantryProduct[] = [];
  public miscellaneousItems: PantryProduct[] = [];

  public categoryNameMap = new Map<ProductCategory, PantryProduct[]>();

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

  i: number;
  j: number;
  lengthAllProducts: number;
  lengthItems: number;
  lengthAllPantryItems: number;

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

  getItemsFromServer(): void {
    this.unsub();
    this.getItemsSub = this.pantryService.getPantryItems({
      category: this.productCategory,
      name: this.ItemName
    }).subscribe(returnedItems => {
      this.serverFilteredPantryProducts = returnedItems;
      this.initializeCategoryMap();
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

  initializeCategoryMap() {
    // eslint-disable-next-line prefer-const
    for (let givenCategory of this.categoriesList) {
      this.categoryNameMap.set(givenCategory,
        this.pantryService.filterPantryProducts(this.serverFilteredPantryProducts, { category: givenCategory }));

    }
    console.log(this.categoryNameMap);
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
    // lgtm[duplicate-code]
  public updateFilter(): void {
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
      this.serverFilteredPantryProducts, { category: this.productCategory, name: this.ItemName }
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

  public reloadComponent() {
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
  unsubDatesUnfiltered(): void {
    if (this.getUnfilteredDates) {
      this.getUnfilteredDates.unsubscribe();
    }
  }

  unsubItemsUnfiltered(): void {
    if (this.getUnfilteredItemsSub) {
      this.getUnfilteredItemsSub.unsubscribe();
    }
  }

  openDeleteDialog(pname: string, id: string, productz: string) {
    this.getUnfilteredDates = this.pantryService.getPantryItemsForDelete({ productz }).subscribe(returnedPantryItems => {
      this.filteredPantryItems = returnedPantryItems;
      this.lengthAllPantryItems = this.filteredPantryItems.length;
    });
    this.tempId = id;
    this.tempName = pname;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: { _id: this.tempId } },);
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  openDeleteDialog2(productz: string) {
    this.getUnfilteredDates = this.pantryService.getPantryItemsForDelete({ productz }).subscribe(returnedPantryItems => {
      this.filteredPantryItems = returnedPantryItems;
      this.lengthAllPantryItems = this.filteredPantryItems.length;
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
        this.tempDeleted = item;
      }
    );
    this.reloadComponent();
    this.tempDialog.close();
    this.snackBar.open('Product deleted', 'OK', {
      duration: 5000,
    });
    this.getItemsFromServer();
    this.getUnfilteredItems();
    return this.tempDeleted;
  }

  openAddDialog(givenProduct: Product) {
    const dialogRef = this.dialog.open(AddProductToPantryComponent, {data: givenProduct});
    dialogRef.afterClosed().subscribe(result => {
      this.pantryService.addPantryItem(result).subscribe(newPantryId => {
        if(newPantryId) {
          this.snackBar.open('Product successfully added to your pantry.');
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to the pantry.');
        }
        this.reloadComponent();
      });
    });
  }

  /* istanbul ignore next */
  getUnfilteredPantryItems(): void {
    this.unsubDatesUnfiltered();
    this.getUnfilteredDates = this.pantryService.getPantryItemsForDelete().subscribe(returnedDates => {
      this.filteredPantryItems = returnedDates;
      this.lengthAllPantryItems = this.filteredPantryItems.length;
    });
  }
}
