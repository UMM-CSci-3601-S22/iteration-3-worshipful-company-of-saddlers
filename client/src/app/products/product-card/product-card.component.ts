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

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  @Input() changeProductForm: FormGroup;
  @Input() formExists: boolean;
  id: string;
  getProductSub: Subscription;
  popup = false;
  panelOpenState = false; //Unsure what this is

  changeProductFormMessages = {
    product_name: [
      {type: 'required', message: 'Product\'s name is required'},
      {type: 'minlength', message: 'Product name must be at least 1 character'},
      {type: 'maxlength', message: 'Product name must be at less than 100 characters'},
      {
        type: 'existingName', message: 'There is already a product with the same name' +
          ' in the pantry'
      }
    ],
    description: [
      {type: 'minlength', message: 'Product description must be at least 1 character'},
      {type: 'maxlength', message: 'Product description must be at less than 200 characters'}
    ],
    brand: [
      {type: 'required', message: 'Product brand is required'},
      {type: 'minlength', message: 'Product brand must be at least 1 character'},
      {type: 'maxlength', message: 'Product brand must be at less than 100 characters'}
    ],
    category: [
      {type: 'required', message: 'Product category is required'},
      {type: 'pattern', message: 'Category must be, bakery, produce, meat, dairy, frozen foods, ' +
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
      {type: 'maxlength', message: 'Product notes must be at less than 200 characters'}
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

  constructor(private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
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
