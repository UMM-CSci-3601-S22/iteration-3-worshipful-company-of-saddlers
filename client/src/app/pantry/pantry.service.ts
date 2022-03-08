import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductCategory } from '../products/product';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';

  constructor(private httpClient: HttpClient) {}

  getPantryItems(filters?: { category?: ProductCategory; store?: string }): Observable<Product[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.store) {
        httpParams = httpParams.set('store', filters.store);
      }
    }
    return this.httpClient.get<Product[]>(this.pantryUrl, {
      params: httpParams,
    });
  }


}
