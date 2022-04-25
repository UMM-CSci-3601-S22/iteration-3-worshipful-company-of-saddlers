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
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  MatSnackBarModule
];

describe('ShoppingListListComponent', () => {
  let shoppingListList: ShoppingListListComponent;
  let fixture: ComponentFixture<ShoppingListListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ ShoppingListListComponent],
      providers: [{ provide: ShoppingListService, useValue: new MockShoppingListService() }, ]
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
      providers: [{ provide: ShoppingListService, useValue: shoppingListServiceStub }]
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
