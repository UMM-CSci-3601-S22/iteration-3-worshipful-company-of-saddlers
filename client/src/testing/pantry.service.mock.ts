/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { Product, ProductCategory } from '../app/products/product';

/**
 * A "mock" version of the `PantryService` that can be used to test components
 * without having to create an actual service.
 */
 @Injectable()
 export class MockPantryService extends PantryService {
   static testPantryProducts: PantryItem[] = [
    {
      _id: 'banana _id',
      product: 'banana product id',
      name: 'banana',
      category: 'produce',
      purchase_date: new Date('2037-05-12T05:00:00.000Z'),
      notes: 'notes for banana pantry item'
    },
    {
      _id: 'milk _id',
      product: 'milk product id',
      name: 'milk',
      category: 'dairy',
      purchase_date: new Date('2037-05-12T05:00:00.000Z'),
      notes: 'notes for milk pantry item'
    },
    {
      _id: 'bread _id',
      product: 'bread product id',
      name: 'bread',
      category: 'baked goods',
      purchase_date: new Date('2037-05-12T05:00:00.000Z'),
      notes: 'notes for bread pantry item'
    }
   ];

   deletedItem: PantryItem;

   constructor() {
     super(null);
   }

   getPantryItems(): Observable<PantryItem[]> {
     // Just return the test products regardless of what filters are passed in
     return of(MockPantryService.testPantryProducts);
   }

   deleteItem(id: string): Observable<PantryItem> {
    if (id === MockPantryService.testPantryProducts[0]._id) {this.deletedItem = MockPantryService.testPantryProducts[0];}
    if (id === MockPantryService.testPantryProducts[1]._id) {this.deletedItem = MockPantryService.testPantryProducts[1];}
    if (id === MockPantryService.testPantryProducts[2]._id) {this.deletedItem = MockPantryService.testPantryProducts[2];}
     return of(this.deletedItem);
   }
 }
