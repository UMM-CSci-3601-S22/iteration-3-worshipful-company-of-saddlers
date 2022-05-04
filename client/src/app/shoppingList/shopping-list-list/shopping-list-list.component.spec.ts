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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockShoppingListService } from '../../../testing/shoppingList.service.mock';
import { ShoppingList } from '../shoppingList';
import { ShoppingListListComponent } from './shopping-list-list.component';
import { ShoppingListService } from './shoppingList.service';
import { PantryService } from 'src/app/pantry/pantry.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/products/product.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';

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
  BrowserAnimationsModule,
  RouterTestingModule,
  MatDialogModule,
  MatSnackBarModule,
  HttpClientTestingModule,
];

describe('ShoppingListListComponent', () => {
  let shoppingListList: ShoppingListListComponent;
  let fixture: ComponentFixture<ShoppingListListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ ShoppingListListComponent],
      providers: [{ provide: ShoppingListService, ProductService, PantryService,
         useValue: new MockShoppingListService() },
      ProductService,
      PantryService,
      PantryProductsListComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ShoppingListListComponent);
      shoppingListList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(shoppingListList).toBeTruthy();
  });
  it('should contain all items', () => {
    expect(shoppingListList.filteredShoppingList.length).toBe(3);
  });
  it('contains a product with name \'Apple\'', () => {
    expect(shoppingListList.filteredShoppingList.some((item: ShoppingList) => item.name === 'Apple')).toBe(true);
  });
  it('contains a product with name \'Root Beer\'', () => {
    expect(shoppingListList.filteredShoppingList.some((item: ShoppingList) => item.name === 'Root Beer')).toBe(true);
  });
  it('contains a product with name \'Orange\'', () => {
    expect(shoppingListList.filteredShoppingList.some((item: ShoppingList) => item.name === 'Orange')).toBe(true);
  });
  it('should be able to unsub', () => {
    expect(shoppingListList.getItemsSub).toBeTruthy();
    shoppingListList.unsub();
    expect(!shoppingListList.getItemsSub.closed).toBeFalsy();
  });

  describe('Remove shopping list item', () => {

    it('should open delete dialogue and remove apple shopping list item', () => {
      expect(shoppingListList.filteredShoppingList.length).toBe(3);
      shoppingListList.openDeleteDialog(shoppingListList.filteredShoppingList[0]);
      fixture.detectChanges();
      shoppingListList.removeItem('apple_id');
      shoppingListList.getItemsFromServer();
      expect(shoppingListList.filteredShoppingList.length).toBe(2);
    });
    it('Generates a shoppingList', () => {
      // Since the observer throws an error, we don't expect shoppingLists to be defined.
      expect(shoppingListList.filteredShoppingList.length).toBe(3);
      shoppingListList.genShopList();
      expect(shoppingListList.filteredShoppingList.length).toBe(4);
    });
  });
});

describe('Misbehaving ShoppingList List', () => {
  let shoppingListList: ShoppingListListComponent;
  let fixture: ComponentFixture<ShoppingListListComponent>;

  let shoppingListServiceStub: {
    getShoppingList: () => Observable<ShoppingList[]>;
  };

  beforeEach(() => {
    // stub ShoppingListService for test purposes
    shoppingListServiceStub = {
      getShoppingList: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ShoppingListListComponent],
      // providers:    [ ShoppingListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: ShoppingListService, useValue: shoppingListServiceStub },
      ProductService,
      PantryProductsListComponent,
      PantryService]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ShoppingListListComponent);
      shoppingListList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a ShoppingListListService', () => {
    // Since the observer throws an error, we don't expect shoppingLists to be defined.
    expect(shoppingListList.filteredShoppingList).toBeUndefined();
  });


});
