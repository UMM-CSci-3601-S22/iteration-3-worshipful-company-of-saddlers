/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockProductService } from '../../../testing/product.service.mock';
import { Product } from '../product';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('ProductListComponent', () => {
  let productList: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: new MockProductService() }]
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      productList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(productList).toBeTruthy();
  });

  it('contains all the products', () => {
    expect(productList.serverFilteredProducts.length).toBe(3);
  });

  it('contains a product named \'banana\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.product_name === 'banana')).toBe(true);
  });

  it('contain a product named \'Wheat Bread\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.product_name === 'Wheat Bread')).toBe(true);
  });

  it('doesn\'t contain a product named \'Santa\'', () => {
    expect(productList.serverFilteredProducts.some((product: Product) => product.product_name === 'Santa')).toBe(false);
  });

  it('has one product that is dairy', () => {
    expect(productList.serverFilteredProducts.filter((product: Product) => product.category === 'dairy').length).toBe(1);
  });

  it('should call openDeleteDialog and call removeProduct', () => {
    productList.openDeleteDialog('banana', 'banana_id');
    fixture.detectChanges();
    productList.removeProduct('banana_id');
  });

  it('should update all product lists on removeProduct call', () => {
  productList.allProducts = productList.serverFilteredProducts;
  productList.filteredProducts = productList.serverFilteredProducts;
  productList.bakeryProducts = productList.serverFilteredProducts;
  productList.produceProducts = productList.serverFilteredProducts;
  productList.meatProducts = productList.serverFilteredProducts;
  productList.dairyProducts = productList.serverFilteredProducts;
  productList.frozenProducts = productList.serverFilteredProducts;
  productList.cannedProducts = productList.serverFilteredProducts;
  productList.drinkProducts = productList.serverFilteredProducts;
  productList.generalProducts = productList.serverFilteredProducts;
  productList.miscellaneousProducts = productList.serverFilteredProducts;
  productList.seasonalProducts = productList.serverFilteredProducts;
  productList.openDeleteDialog('banana', 'banana_id');
  productList.removeProduct('banana_id');
  });

  it('should update filteredProducts on activeFilters', () => {
    productList.productCategory = 'produce';
    productList.productBrand = 'Dole';
    productList.getProductsFromServer();
    //expect(productList.filteredProducts.some((product: Product) => product.product_name === 'banana')).toBe(true);
  });

});


describe('Misbehaving Product List', () => {
  let productList: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  let productServiceStub: {
    getProducts: () => Observable<Product[]>;
    getProductsFiltered: () => Observable<Product[]>;
  };

  beforeEach(() => {
    // stub ProductService for test purposes
    productServiceStub = {
      getProducts: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getProductsFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ProductListComponent],
      // providers:    [ ProductService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: ProductService, useValue: productServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProductListComponent);
      productList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
});
