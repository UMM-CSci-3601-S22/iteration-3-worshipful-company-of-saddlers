import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProductService } from 'src/app/products/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from 'src/app/products/product';
import { ShoppingListService } from '../shopping-list-list/shoppingList.service';
import { ShoppingList } from '../shoppingList';
import { ShoppingListListComponent } from '../shopping-list-list/shopping-list-list.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-shopping-list',
  templateUrl: './add-to-shopping-list.component.html',
  styleUrls: ['./add-to-shopping-list.component.scss']
})
export class AddToShoppingListComponent implements OnInit {

  addToShoppingListForm: FormGroup;

  shoppingList: ShoppingList;

  addToShoppingListValidationMessages = {
    quantity: [
      {type: 'required', message: 'Shopping list items must have a quantity'},
      {type: 'max', message: 'Quantity must be less than 10,000'},
      {type: 'min', message: 'Quantity must be greater than 0'},
    ],
  };

  constructor(private fb: FormBuilder, private shoppingListService: ShoppingListService,
    private snackBar: MatSnackBar, private router: Router, private shoppingListComp: ShoppingListListComponent,
    public dialogRef: MatDialogRef<AddToShoppingListComponent>,
     @Inject(MAT_DIALOG_DATA) public data: Product)
     { }

    createForms() {
      this.addToShoppingListForm = this.fb.group({
        productID: this.data._id,

        name: this.data.product_name,

        quantity: new FormControl('', Validators.compose([
          Validators.pattern('^[0-9]+$'),
          Validators.max(10000),
          Validators.min(0),
          Validators.required,
        ])),

      });
    }

  ngOnInit(): void {
    this.createForms();
  }

  /* istanbul ignore next */
  submitForm() {
    return this.addToShoppingListForm.value;
  }

}
