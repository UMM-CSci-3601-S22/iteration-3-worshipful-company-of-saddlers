import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductCategory } from 'src/app/products/product';
import { ProductService } from 'src/app/products/product.service';

@Injectable()
export class MockProductService extends ProductService {
  static testProducts: Product[] = [
    {
      _id: 'apple_id',
      productName: 'apple',
      description: 'red fruit',
      brand: 'dole',
      category: 'produce',
      store: 'willies',
      location: 'aisle 2',
      notes: 'pretty good apple 8/10',
      tags: ['fruit'],
      lifespan: 14,
      threshold: 28,
      image: 'http://dummyimage.com/149x100.png/dddddd/000000'
    },
    {
      _id: 'potato_id',
      productName: 'potato',
      description: 'brown spud',
      brand: 'earth brand',
      category: 'produce',
      store: 'willies',
      location: 'aisle 1',
      notes: 'pretty good spud 8/10',
      tags: ['tuber'],
      lifespan: 11,
      threshold: 22,
      image: 'http://dummyimage.com/149x100.png/dddddd/000000'
    },
    {
      _id: 'cereal_id',
      productName: 'cereal',
      description: 'grainy cereal',
      brand: 'kellogs',
      category: 'miscellaneous',
      store: 'willies',
      location: 'aisle 5',
      notes: 'pretty good cereal 8/10',
      tags: ['grain'],
      lifespan: 15,
      threshold: 3,
      image: 'http://dummyimage.com/149x100.png/dddddd/000000'
    }
  ];

  constructor() {
    super(null);
  }

  getProducts(filters?: { category?: ProductCategory; store?: string }): Observable<Product[]> {
      return of(MockProductService.testProducts);
  }

  getProductById(id: string): Observable<Product> {
      if (id === MockProductService.testProducts[0]._id) {
        return of(MockProductService.testProducts[0]);
      } else {
        return of(null);
      }
  }
}
