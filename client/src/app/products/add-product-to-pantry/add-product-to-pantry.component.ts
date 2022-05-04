/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../product';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss'],
})

export class AddProductToPantryComponent implements OnInit {

  //@Input() product: Product;

  addToPantryForm: FormGroup;
  pantryItem: PantryItem;


  addPantryValidationMessages = {
    purchase_date: [
      {type: 'required', message: 'Purchase date is required'},
      {type: 'maxlength', message: 'Pantry item date must be 10 characters'},
      {type: 'minlength', message: 'Pantry item date must be 10 characters'}
    ],
    notes: [
      {type: 'maxlength', message: 'Pantry item notes must be less than 500 characters'}
    ]
  };

  constructor(private fb: FormBuilder, private pantryService: PantryService,
     private snackBar: MatSnackBar, private router: Router, private pantryList: PantryProductsListComponent,
     public dialogRef: MatDialogRef<AddProductToPantryComponent>,
     @Inject(MAT_DIALOG_DATA) public data: Product) {
  }

  createForms() {
    this.addToPantryForm = this.fb.group({
      product: this.data._id,

      name: this.data.product_name,

      category: this.data.category,

      purchase_date: new FormControl(new Date(),
      Validators.compose([
        Validators.required
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.maxLength(500)
      ])),
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  /* istanbul ignore next */
  submitForm() {
  return this.addToPantryForm.value;
}

}
