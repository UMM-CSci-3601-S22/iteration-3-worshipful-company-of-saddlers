/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPantryService } from 'src/testing/pantry.service.mock';
import { PantryService } from '../pantry.service';
import { ProductService } from '../../products/product.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PantryProductsListComponent } from './pantry-products-list.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductListComponent } from 'src/app/products/product-list/product-list.component';


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
  MatSnackBarModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  MatDialogModule,
  HttpClientTestingModule,
];

describe('PantryProductsListComponent', () => {
  let pantryProductsList: PantryProductsListComponent;
  let fixture: ComponentFixture<PantryProductsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [PantryProductsListComponent],
      providers: [{ provide: PantryService, ProductService, useValue: new MockPantryService() },
        ProductService,
        MatDialog]
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PantryProductsListComponent);
      pantryProductsList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(pantryProductsList).toBeTruthy();
  });

  it ('should have 3 items in it', () => {
    expect(pantryProductsList.pantryProducts.length).toBe(3);
  });
  it('should call openDeleteDialog and call removeItem on milk', () => {
    pantryProductsList.produceItems = pantryProductsList.serverFilteredItems;
    expect(pantryProductsList.pantryProducts.length).toBe(3);
    pantryProductsList.openDeleteDialog('milk', 'milk_id');
    fixture.detectChanges();
    pantryProductsList.removeItem('milk_id');
    pantryProductsList.getItemsFromServer();
    expect(pantryProductsList.serverFilteredItems.length).toBe(2);
  });

  it('should call openDeleteDialog and call removeProduct on bread', () => {
    pantryProductsList.produceItems = pantryProductsList.serverFilteredItems;
    expect(pantryProductsList.pantryProducts.length).toBe(3);
    pantryProductsList.openDeleteDialog('bread', 'bread_id');
    fixture.detectChanges();
    pantryProductsList.removeItem('bread_id');
    pantryProductsList.getItemsFromServer();
    expect(pantryProductsList.serverFilteredItems.length).toBe(2);
  });

  it('should call openDeleteDialog and call removeProduct on banana', () => {
    expect(pantryProductsList.pantryProducts.length).toBe(3);
    pantryProductsList.openDeleteDialog('banana', 'banana_id');
    fixture.detectChanges();
    pantryProductsList.removeItem('banana_id');
    pantryProductsList.getItemsFromServer();
    expect(pantryProductsList.serverFilteredItems.length).toBe(2);
  });
  it('should call update filter', () =>{
    pantryProductsList.updateFilter();
    expect(pantryProductsList.activeFilters).toBeFalsy();
    pantryProductsList.name = 'john';
    pantryProductsList.updateFilter();
    expect(pantryProductsList.activeFilters).toBeTruthy();
  });
  it('should call update item filter', () =>{
    pantryProductsList.updateItemFilter();
    expect(pantryProductsList.activeFilters).toBeFalsy();
    pantryProductsList.ItemName = 'konner';
    pantryProductsList.updateItemFilter();
    expect(pantryProductsList.activeFilters).toBeTruthy();
  });
  it('should reload', () =>{
    // this is hard to prove it actually did something. Issue for iteration 4
    pantryProductsList.reloadComponent();
  });
});

