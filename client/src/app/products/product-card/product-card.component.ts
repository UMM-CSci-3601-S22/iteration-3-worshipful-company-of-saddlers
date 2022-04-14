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

  changeProductForm: FormGroup;
  id: string;
  threshold: number;
  getProductSub: Subscription;
  popup = false;
  panelOpenState = false; //Unsure what this is

  changeProductFormMessages = {
    name: [
      { type: 'required', message: 'Must provide a product name.' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
      {
        type: 'existingName', message: 'There is already a product with the same name' +
          ' in the pantry'
      }
    ],

    brand: [
      { type: 'required', message: 'Must provide a brand' },
      { type: 'maxlength', message: 'Brand cannot be more than 50 characters long' }
    ],

    store: [
      { type: 'required', message: 'Must provide a store.' },
      { type: 'maxlength', message: 'Store cannot be more than 50 characters long' }
    ],

    lifespan: [
      { type: 'min', message: 'Lifespan must be greater than 0' }
    ],

    threshold: [
      { type: 'min', message: 'Threshold cannot be negative' }
    ],

    category: [
      { type: 'required', message: 'Must provide a category.' },
    ],
  };

  constructor(private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.createForms();
  }

  createForms() {
    this.changeProductForm = this.fb.group({
      _id: new FormControl(this.product._id),
      name: new FormControl(this.product.product_name, Validators.compose([
        Validators.minLength(0),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({ existingName: true });
          } else {
            return null;
          }
        },
      ])),
      brand: new FormControl(this.product.brand),
      store: new FormControl(this.product.store),
      lifespan: new FormControl(this.product.lifespan),
      description: new FormControl(this.product.description),
      category: new FormControl(this.product.category),
      location: new FormControl(this.product.location),
      notes: new FormControl(this.product.notes),
      threshold: new FormControl(this.product.threshold, Validators.compose([
        Validators.min(0),
        Validators.pattern('^[0-9]+$')
      ]))
    });
  }

  submitForm() {
    this.productService.changeProduct(this.changeProductForm.value).subscribe(newID => {
      this.snackBar.open('Updated Product Fields', null, { duration: 2000, });
      this.reloadComponent();
    }, err => {
      this.snackBar.open('Failed to add the product', 'OK', {
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
