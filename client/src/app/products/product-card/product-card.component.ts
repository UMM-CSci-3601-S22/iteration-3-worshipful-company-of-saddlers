/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { AddProductToPantryComponent } from '../add-product-to-pantry/add-product-to-pantry.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { AddProductComponent } from '../add-product/add-product.component';
import { PantryService } from 'src/app/pantry/pantry.service';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingListListComponent } from 'src/app/shoppingList/shopping-list-list/shopping-list-list.component';
import { ShoppingListService } from 'src/app/shoppingList/shopping-list-list/shoppingList.service';
import { AddToShoppingListComponent } from 'src/app/shoppingList/add-to-shopping-list/add-to-shopping-list.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
// lgtm[duplicate-code]
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  @Input() changeProductForm: FormGroup;
  @Input() formExists: boolean;

  id: string;
  getProductSub: Subscription;
  popup = false;
  addToShoppingListPopup = false;
  panelOpenState = false; //Unsure what this is
  changeProductFormMessages;

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private pantryService: PantryService, private shoppingListService: ShoppingListService,
    private dialog: MatDialog, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.changeProductFormMessages = AddProductComponent.createValidationForm();
  }

/* istanbul ignore next */
  openAddDialog(givenProduct: Product) {
    const dialogRef = this.dialog.open(AddProductToPantryComponent, {data: givenProduct});
    dialogRef.afterClosed().subscribe(result => {
      this.pantryService.addPantryItem(result).subscribe(newPantryId => {
        if(newPantryId) {
          this.snackBar.open('Product successfully added to your pantry.');
          this.router.navigate(['']);
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to the pantry.');
        }
      });
    });
  }

  openAddDialogShoppingList(givenProduct: Product) {
    console.log(givenProduct);
    const dialogRef = this.dialog.open(AddToShoppingListComponent, {data: givenProduct});
    dialogRef.afterClosed().subscribe(result => {
      this.shoppingListService.addShoppingList(result).subscribe(newShoppingListId => {
        if(newShoppingListId) {
          this.snackBar.open('Product successfully added to your shopping list.');
          this.router.navigate(['/shoppingList/']);
        }
        else {
          this.snackBar.open('Something went wrong.  The product was not added to your shopping list.');
        }
      });
    });
  }


  submitForm() {
    console.log(this.changeProductForm.value);
    this.productService.changeProduct(this.changeProductForm.value).subscribe(newID => {
      this.snackBar.open('Updated Product Fields', null, { duration: 2000, });
      this.reloadComponent();
    }, err => {
      this.snackBar.open('Failed to edit the product', 'OK', {
        duration: 5000,
      });
    });
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
