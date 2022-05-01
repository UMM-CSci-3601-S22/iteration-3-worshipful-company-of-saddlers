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

  //  deleteItem(id: string): Observable<PantryItem> {
  //   if (id === MockPantryService.testPantryProducts[0]._id) {this.deletedItem = MockPantryService.testPantryProducts[0];
  //     MockPantryService.testPantryProducts.pop();}
  //   if (id === MockPantryService.testPantryProducts[1]._id) {this.deletedItem = MockPantryService.testPantryProducts[1];
  //     MockPantryService.testPantryProducts.pop();}
  //   if (id === MockPantryService.testPantryProducts[2]._id) {this.deletedItem = MockPantryService.testPantryProducts[2];
  //     MockPantryService.testPantryProducts.pop();}
  //    return of(this.deletedItem);
  //  }

/*
  deleteItem(id: string): Observable<PantryItem> {
    //This is the best we could come up with. We know the pop is not correct.
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0; i < this.testPantryProducts.length; i++){
      if(id === this.testPantryProducts[i]._id){
        this.testPantryProducts.pop();
        this.deletedItem = this.testPantryProducts[i];
      }
    }
    return of(this.deletedItem);
 }
 */
}
