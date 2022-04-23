/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPantryService } from 'src/testing/pantry.service.mock';
import { PantryService } from 'src/app/pantry/pantry.service';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { AddToShoppingListComponent } from './add-to-shopping-list.component';
import { ShoppingListListComponent } from '../shopping-list-list/shopping-list-list.component';

describe('AddToShoppingListComponent', () => {
  let addToShoppingListComponent: AddToShoppingListComponent;
  let addProductToShoppingListForm: FormGroup;
  let fixture: ComponentFixture<AddToShoppingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule
      ],

      declarations: [ AddToShoppingListComponent ],
      providers: [{ provide: PantryService, useValue: new MockPantryService() },
        PantryProductsListComponent,
        ShoppingListListComponent,
        HttpClient,
        HttpHandler,
        MatDialog,]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToShoppingListComponent);
    addToShoppingListComponent = fixture.componentInstance;
    addToShoppingListComponent.product = {
      _id: 'banana_id',
      product_name: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Willies',
      location: '',
      notes: '',
      lifespan: 0,
      threshold: 0,
      image: ''
    };
    /*addProductToPantryComponent.pantryItem = {
        _id: 'banana _id',
        product: 'banana product id',
        purchase_date: '01-02-2022',
        notes: 'notes for banana pantry item'
      };*/
      addToShoppingListComponent.ngOnInit();
    fixture.detectChanges();
    addProductToShoppingListForm = addToShoppingListComponent.addToShoppingListForm;
    expect(addToShoppingListComponent).toBeDefined();
    expect(addProductToShoppingListForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(addToShoppingListComponent).toBeTruthy();
  });
});
