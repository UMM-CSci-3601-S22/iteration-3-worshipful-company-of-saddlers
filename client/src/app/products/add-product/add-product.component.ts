/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  addProductForm: FormGroup;

  product: Product;

  addProductValidationMessages = {
    product_name: [
      {type: 'required', message: 'Product\'s name is required'},
      {type: 'minlength', message: 'Product name must be at least 1 character'},
      {type: 'maxlength', message: 'Product name must be at less than 200 characters'}
    ],
    description: [
      {type: 'minlength', message: 'Product description must be at least 1 character'},
      {type: 'maxlength', message: 'Product description must be at less than 500 characters'}
    ],
    brand: [
      {type: 'required', message: 'Product brand is required'},
      {type: 'minlength', message: 'Product brand must be at least 1 character'},
      {type: 'maxlength', message: 'Product brand must be at less than 100 characters'}
    ],
    category: [
      {type: 'required', message: 'Product category is required'},
      {type: 'pattern', message: 'Category must be, bakery, produce, meat, dairy, frozen foods,' +
        'canned goods, drinks, general grocery, miscellaneous, or seasonal'},
    ],
    store: [
      {type: 'required', message: 'Product store is required'},
      {type: 'minlength', message: 'Product store must be at least 1 character'},
      {type: 'maxlength', message: 'Product store must be at less than 100 characters'}
    ],
    location: [
      {type: 'minlength', message: 'Product location must be at least 1 character'},
      {type: 'maxlength', message: 'Product location must be at less than 100 characters'}
    ],
    notes: [
      {type: 'minlength', message: 'Product notes must be at least 1 character'},
      {type: 'maxlength', message: 'Product notes must be at less than 350 characters'}
    ],
    tags: [
      {type: 'minlength', message: 'Product notes must be at least 1 character'},
      {type: 'maxlength', message: 'Product notes must be at less than 50 characters'}
    ],
    lifespan: [
      {type: 'min', message: 'Product lifespan must be at least 1'},
      {type: 'max', message: 'Product lifespan must be at less than 1000000'},
      {type: 'pattern', message: 'Lifespan must be a whole number'}
    ],
    threshold: [
      {type: 'min', message: 'Product threshold must be at least 1'},
      {type: 'max', message: 'Product threshold must be at less than 1000000'},
      {type: 'pattern', message: 'Threshold must be a whole number'}
    ]
  };
  constructor(private fb: FormBuilder, private productService: ProductService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {
    this.addProductForm = this.fb.group({
      product_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ])),

      description: new FormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(500),
      ])),

      brand: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ])),

      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(bakery|produce|meat|dairy|frozen foods|canned goods|drinks|general grocery|miscellaneous|seasonal)$')
      ])),

      store: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ])),

      location: new FormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(100),
      ])),

      notes: new FormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(350),
      ])),

      tags: new FormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(50),
      ])),

      lifespan: new FormControl('', Validators.compose([
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern('^[0-9]+$')
      ])),

      threshold: new FormControl('', Validators.compose([
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern('^[0-9]+$')
      ]))

    });
  }
  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    this.productService.addProduct(this.addProductForm.value).subscribe(newID => {
      this.snackBar.open('Added Product' + this.addProductForm.value.product_name, null, {
        duration: 2000,
      });
      this.router.navigate(['/products/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the product', 'OK', {
        duration: 5000,
    });
    });
  }

}
