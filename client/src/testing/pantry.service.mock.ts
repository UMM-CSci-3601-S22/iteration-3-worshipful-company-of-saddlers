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
      purchase_date: '01-02-2022',
      notes: 'notes for banana pantry item'
    },
    {
      _id: 'milk _id',
      product: 'milk product id',
      purchase_date: '02-02-2022',
      notes: 'notes for milk pantry item'
    },
    {
      _id: 'bread _id',
      product: 'bread product id',
      purchase_date: '03-02-2022',
      notes: 'notes for bread pantry item'
    }
   ];

   constructor() {
     super(null);
   }

   getPantryItems(): Observable<PantryItem[]> {
     // Just return the test products regardless of what filters are passed in
     return of(MockPantryService.testPantryProducts);
   }

 }
