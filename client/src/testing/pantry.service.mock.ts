/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PantryService } from 'src/app/pantry/pantry.service';
import { Product, ProductCategory } from '../app/products/product';

/**
 * A "mock" version of the `PantryService` that can be used to test components
 * without having to create an actual service.
 */
 @Injectable()
 export class MockPantryService extends PantryService {
   static testPantryProducts: Product[] = [
    {
      _id: 'banana_id',
      product_name: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'milk_id',
      product_name: 'Whole Milk',
      description: '',
      brand: 'Land O Lakes',
      category: 'dairy',
      store: 'SuperValu',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'bread_id',
      product_name: 'Wheat Bread',
      description: '',
      brand: 'Country Hearth',
      category: 'bakery',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    }
   ];

   constructor() {
     super(null);
   }

   getPantryItems(): Observable<Product[]> {
     // Just return the test products regardless of what filters are passed in
     return of(MockPantryService.testPantryProducts);
   }

 }
