/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { PantryProduct } from 'src/app/pantry/pantryProduct';
import { Product, ProductCategory } from '../app/products/product';

/**
 * A "mock" version of the `PantryService` that can be used to test components
 * without having to create an actual service.
 */
 @Injectable()
 export class MockPantryService extends PantryService {
  testPantryProducts: PantryProduct[] = [
    {
      _id: 'banana_id',
      product: 'banana product id',
      name: 'banana',
      category: 'produce',
      quantity: 4
    },
    {
      _id: 'milk_id',
      product: 'milk product id',
      name: 'milk',
      category: 'dairy',
      quantity: 6
    },
    {
      _id: 'bread_id',
      product: 'bread product id',
      name: 'bread',
      category: 'baked goods',
      quantity: 1
    }
   ];

  // deletedItem: PantryProduct;

   constructor() {
     super(null);
   }

   getPantryItems(): Observable<PantryProduct[]> {
     // Just return the test products regardless of what filters are passed in
     return of(this.testPantryProducts);
   }

}
