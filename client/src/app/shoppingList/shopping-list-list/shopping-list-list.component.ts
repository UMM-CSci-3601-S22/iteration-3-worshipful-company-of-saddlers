/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { PantryService } from 'src/app/pantry/pantry.service';
import { ShoppingList } from '../shoppingList';
import { ShoppingListService } from './shoppingList.service';
import { Product } from 'src/app/products/product';
import { AddToShoppingListComponent } from '../add-to-shopping-list/add-to-shopping-list.component';
import { ProductService } from 'src/app/products/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.scss']
})

export class ShoppingListListComponent implements OnInit {

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  public filteredShoppingList: ShoppingList[];
  public filteredProducts: Product[];
  public allProducts: Product[] = [];

  getUnfilteredProductsSub: Subscription;

  // instead of typing shopping list i'm going to replace it with item
  public itemName: string;
  public itemProdID: string;
  public itemQuantity: number;
  public tempName: string;
  public name: string;
  public activeFilters: boolean;

  getItemsSub: Subscription;
  tempDialog: any;
  tempID: string;
  lengthAllProducts: number;

  constructor(private shoppingListService: ShoppingListService, private productService: ProductService,
    private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  constructor(private shoppingListService: ShoppingListService, public dialog: MatDialog,
    private router: Router, private snackBar: MatSnackBar) { }

  getItemsFromServer(): void {
    this.unsub();
    this.getItemsSub = this.shoppingListService.getShoppingList({
      name: this.itemName
    }).subscribe(returnedShoppingList => {
      this.filteredShoppingList = returnedShoppingList;
    }, err => {
      console.log(err);
    });
  }

  public reloadComponent() {
    const shoppingListUrl = 'shoppingList';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([shoppingListUrl]);
  }

  ngOnInit(): void {
    this.getItemsFromServer();
    this.getUnfilteredProducts();
  }

  unsub(): void {
    if (this.getItemsSub) {
      this.getItemsSub.unsubscribe();
    }
  }
  openDeleteDialog(shoppingList: ShoppingList){
    this.tempID = shoppingList._id;
    this.tempName = shoppingList.name;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: {_id: this.tempID}},);
    this.tempDialog.afterClosed().subscribe();
  }

  removeItem(id: string): ShoppingList {
    let tempDeleted: any;
    this.shoppingListService.deleteItem(id).subscribe(
      item => {
        tempDeleted = item;
      }
    );
    this.reloadComponent();
    this.tempDialog.close();
    this.snackBar.open('Item removed from Shopping List', 'OK', {
      duration: 5000,
    });
    return tempDeleted;
  }

  genShopList() {
    this.shoppingListService.generateShoppingList().subscribe(newID => {
      this.snackBar.open('Updated Product Fields', null, { duration: 2000, });
      this.reloadComponent();
    }, err => {
      this.snackBar.open('Failed to edit the product', 'OK', {
        duration: 5000,
      });
    });

  }

  public reloadComponent() {
    const pantryPageUrl = '/shoppingList/';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([pantryPageUrl]);
  }

  unsubProductsUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
    }
  }

  getUnfilteredProducts(): void {
    this.unsubProductsUnfiltered();
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

  openAddDialog(givenProduct: Product) {
    console.log(givenProduct);
    const dialogRef = this.dialog.open(AddToShoppingListComponent, {data: givenProduct});
    dialogRef.afterClosed().subscribe(result => {
      this.shoppingListService.addShoppingList(result).subscribe(newShoppingListId => {
        if(newShoppingListId) {
          this.snackBar.open('Product successfully added to your shopping list.');
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to your shopping list.');
        }
        this.reloadComponent();
      });
    });
  }
}
