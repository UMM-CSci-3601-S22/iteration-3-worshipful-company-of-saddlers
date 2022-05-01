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
import { Product, ProductCategory, categories, categoryCamelCase } from '../product';
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

  it('should update filteredProducts on activeFilters', () => {
    productList.productCategory = 'produce';
    productList.productBrand = 'Dole';
    productList.getProductsFromServer();
    expect(productList.filteredProducts.some((product: Product) => product.product_name === 'banana')).toBe(true);
  });

});


describe('Delete From ProductList', () => {
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
/*
  it('should call openDeleteDialog and call removeProduct on milk', () => {
    categories.forEach((cat: ProductCategory) => {
      const categoryAsField = categoryCamelCase(cat);
      productList[categoryAsField] = productList.serverFilteredProducts;
    });
    productList.openDeleteDialog('Whole Milk', 'milk_id');
    fixture.detectChanges();
    productList.removeProduct('milk_id');
    expect(productList.allProducts.length).toBe(2);
  });

  it('should call openDeleteDialog and call removeProduct on bread', () => {
    categories.forEach((cat: ProductCategory) => {
      const categoryAsField = categoryCamelCase(cat);
      productList[categoryAsField] = productList.serverFilteredProducts;
    });
    productList.openDeleteDialog('Wheat Bread', 'bread_id');
    fixture.detectChanges();
    productList.removeProduct('bread_id');
    expect(productList.allProducts.length).toBe(2);
  });
*/
  it('should call openDeleteDialog and call removeProduct on banana', () => {
    categories.forEach((cat: ProductCategory) => {
      const categoryAsField = categoryCamelCase(cat);
      productList[categoryAsField] = productList.serverFilteredProducts;
    });
    productList.openDeleteDialog('banana', 'banana_id');
    fixture.detectChanges();
    productList.removeProduct('banana_id');
    expect(productList.allProducts.length).toBe(2);
  });

});
