import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Product } from '../products/product';
import { PantryItem } from './pantryItem';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';

  constructor(private httpClient: HttpClient) {}

  getPantryItems(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.pantryUrl, {
    });
  }

  addPantryItem(newItem: PantryItem): Observable<string> {
    return this.httpClient.post<{id: string}>(this.pantryUrl, newItem).pipe(map(res => res.id));
  }

}
