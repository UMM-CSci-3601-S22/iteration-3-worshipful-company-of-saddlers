import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductCategory } from '../products/product';
import { map } from 'rxjs/operators';
import { PantryItem } from './pantryItem';
import { isDate } from 'lodash';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';
  readonly productUrl: string = environment.apiUrl + 'product';

  ids: string[];
  i: number;
  products: Product[];

  constructor(private httpClient: HttpClient) {}

  getPantryItems(): Observable<PantryItem[]> {
    return this.httpClient.get<PantryItem[]>(this.pantryUrl, {
    });
  }

  addPantryItem(newPantryItem: PantryItem): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.pantryUrl, newPantryItem).pipe(map(res => res.id));
  }

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(this.productUrl + '/' + id);
  }

  getItemIds() {

  }


  getProducts(): Product[]{
    for(this.i = 0; this.i < this.ids.len(); this.i++) {
      this.products[this.i] = this.getProductById(this.ids[this.i]);
    }
    return this.products;
  }

}
