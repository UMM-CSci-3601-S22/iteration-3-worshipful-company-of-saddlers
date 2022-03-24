/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';


@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss']
})

export class AddProductToPantryComponent implements OnInit {

  @Input() product: Product;

  addToPantryForm: FormGroup;

  pantryItem: PantryItem;

  addPantryValidationMessages = {
    product_id: [
      {type: 'required', message: 'A product ID is required'}
    ],
    purchase_date: [
      {type: 'required', message: 'Purchase date is required'}
    ],
    notes: [
      {type: 'maxlength', message: 'Pantry item notes must be less than 200 characters'}
    ]
  };

  constructor(private fb: FormBuilder, private pantryService: PantryService,
     private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {
    this.addToPantryForm = this.fb.group({
      _id: this.product._id,

      purchase_date: new FormControl('', Validators.compose([
        Validators.required,
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.maxLength(200)
      ])),
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    console.log(this.addToPantryForm.value);
    this.pantryService.addPantryItem(this.addToPantryForm.value).subscribe(newID => {
      this.snackBar.open('Added Product to Pantry' + this.addToPantryForm.value.product_name, null, {
        duration: 2000,
      });
      this.router.navigate(['']);
    }, err => {
      this.snackBar.open('Failed to add the product to your pantry', 'OK', {
        duration: 5000,
      });
    });
  }

}
