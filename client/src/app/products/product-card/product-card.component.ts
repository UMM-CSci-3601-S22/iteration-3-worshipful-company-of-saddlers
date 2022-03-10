/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;

  popup = false;

  addToPantryForm: FormGroup;

  //product: Product;

  constructor(private fb: FormBuilder, private pantryService: PantryService,
     private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {
    this.addToPantryForm = this.fb.group({
      _id: this.product._id,

      purchase_date: new FormControl('', Validators.compose([
        Validators.required
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(200),
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
      this.router.navigate(['/pantry/']);
    }, err => {
      this.snackBar.open('Failed to add the product to your pantry', 'OK', {
        duration: 5000,
      });
    });
  }

}
