/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/products/product';
import { ProductService } from 'src/app/products/product.service';
import { PantryService } from '../pantry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-pantry-item',
  templateUrl: './add-pantry-item.component.html',
  styleUrls: ['./add-pantry-item.component.scss']
})
export class AddPantryItemComponent implements OnInit, OnDestroy {

  public allProducts: Product[];

  public productToAdd: Product;

  getUnfilteredProductsSub: Subscription;

  constructor(private productService: ProductService, private pantryService: PantryService,
     private snackBar: MatSnackBar) { }

  // This needs to be able to get all of the products from the product database,
  // so that we can search for a product
  ngOnInit(): void {
    this.getUnfilteredProducts();
  }

  ngOnDestroy(): void {
    this.unsubUnfiltered();
  }

  getUnfilteredProducts(): void {
    this.unsubUnfiltered();
    this.getUnfilteredProductsSub = this.productService.getProducts().subscribe(returnedProducts => {
      this.allProducts = returnedProducts;
    });
  }

  unsubUnfiltered(): void {
    if (this.getUnfilteredProductsSub) {
      this.getUnfilteredProductsSub.unsubscribe();
    }
  }

  filterProducts(product_name: string): Product[] {
    return this.productService.filterProducts(this.allProducts, {product_name});
  }
}
