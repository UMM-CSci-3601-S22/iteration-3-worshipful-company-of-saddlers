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

  it('should call openDeleteDialog and call removeItem on milk', () => {
    pantryProductsList.pantryProducts = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakedGoodsItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakingSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.cleaningItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.dairyItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.deliItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.frozenItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.herbItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.meatItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.miscellaneousItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.paperItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.petSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.produceItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.stapleItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.toiletriesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.openDeleteDialog('milk', 'milk _id');
    fixture.detectChanges();
    pantryProductsList.removeItem('milk _id');
    expect(pantryProductsList.dairyItems.length).toBe(2);
  });

  it('should call openDeleteDialog and call removeProduct on bread', () => {
    pantryProductsList.pantryProducts = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakedGoodsItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakingSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.cleaningItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.dairyItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.deliItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.frozenItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.herbItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.meatItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.miscellaneousItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.paperItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.petSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.produceItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.stapleItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.toiletriesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.openDeleteDialog('bread', 'bread _id');
    fixture.detectChanges();
    pantryProductsList.removeItem('bread _id');
    expect(pantryProductsList.bakedGoodsItems.length).toBe(2);
  });

  it('should call openDeleteDialog and call removeProduct on banana', () => {
    pantryProductsList.pantryProducts = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakedGoodsItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.bakingSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.cleaningItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.dairyItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.deliItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.frozenItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.herbItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.meatItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.miscellaneousItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.paperItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.petSuppliesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.produceItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.stapleItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.toiletriesItems = pantryProductsList.serverFilteredItems;
    pantryProductsList.openDeleteDialog('banana', 'banana _id');
    fixture.detectChanges();
    pantryProductsList.removeItem('banana _id');
    expect(pantryProductsList.produceItems.length).toBe(2);
  });
});

