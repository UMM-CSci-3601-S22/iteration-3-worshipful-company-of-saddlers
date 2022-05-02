import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ShoppingList } from '../shoppingList';
import { ShoppingListService } from './shoppingList.service';

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

  public printPageActive = false;

  getItemsSub: Subscription;
  tempDialog: any;
  tempID: string;

  constructor(private shoppingListService: ShoppingListService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

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

  ngOnInit(): void {
    this.getItemsFromServer();
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
    this.tempDialog.close();
    this.snackBar.open('Item removed from Shopping List', 'OK', {
      duration: 5000,
    });
    return tempDeleted;
  }

  printShoppingList(sectionName) {

    this.printPageActive = true;
    setTimeout(() =>{
    const printContents = document.getElementById(sectionName).innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
    }, 0);
}
}
