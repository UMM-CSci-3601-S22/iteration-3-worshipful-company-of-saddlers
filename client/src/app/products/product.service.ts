import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductCategory } from './product';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService {
  readonly productUrl: string = environment.apiUrl + 'products';

  constructor(private httpClient: HttpClient) {}

  getProducts(filters?: { category?: ProductCategory; store?: string }): Observable<Product[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.store) {
        httpParams = httpParams.set('store', filters.store);
      }
    }
    return this.httpClient.get<Product[]>(this.productUrl, {
      params: httpParams,
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(this.productUrl + '/' + id);
  }

  filterProducts(products: Product[], filters: { productName?: string; brand?: string }): Product[] {

    let filteredProducts = products;

    // Filter by productName
    if (filters.productName) {
      filters.productName = filters.productName.toLowerCase();

      filteredProducts = filteredProducts.filter(product => product.productName.toLowerCase().indexOf(filters.productName) !== -1);
    }

    // Filter by brand
    if (filters.brand) {
      filters.brand = filters.brand.toLowerCase();

      filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase().indexOf(filters.brand) !== -1);
    }

    return filteredProducts;
  }

  addProduct(newProduct: Product): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.productUrl, newProduct).pipe(map(res => res.id));
  }

}
