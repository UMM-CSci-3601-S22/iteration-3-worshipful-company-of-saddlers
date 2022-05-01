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
import { ShoppingListListComponent } from 'src/app/shoppingList/shopping-list-list/shopping-list-list.component';
import { ShoppingListService } from 'src/app/shoppingList/shopping-list-list/shoppingList.service';

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
  addToShoppingListPopup = false;
  panelOpenState = false; //Unsure what this is
  changeProductFormMessages;

  constructor(private route: ActivatedRoute, private productService: ProductService, private shoppingListService: ShoppingListService,
    private fb: FormBuilder, private snackBar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
    this.changeProductFormMessages = AddProductComponent.createValidationForm();
  }

/* istanbul ignore next */
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
