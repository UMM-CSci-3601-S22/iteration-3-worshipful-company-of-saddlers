import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { PantryService } from 'src/app/pantry/pantry.service';
import { ShoppingList } from '../shoppingList';
import { ShoppingListService } from './shoppingList.service';
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

  // instead of typing shopping list i'm going to replace it with item
  public itemName: string;
  public itemProdID: string;
  public itemQuantity: number;
  public tempName: string;

  getItemsSub: Subscription;
  tempDialog: any;
  tempID: string;


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
    this.shoppingListService.generateShoppingList();
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
}
