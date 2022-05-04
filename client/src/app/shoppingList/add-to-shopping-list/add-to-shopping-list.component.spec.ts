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
import { ProductService } from 'src/app/products/product.service';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { AddToShoppingListComponent } from './add-to-shopping-list.component';
import { ShoppingListListComponent } from '../shopping-list-list/shopping-list-list.component';
import { SingleProductPageComponent } from 'src/app/products/single-product-page/single-product-page.component';
import { MockProductService } from 'src/testing/product.service.mock';
import { ProductListComponent } from 'src/app/products/product-list/product-list.component';

describe('AddToShoppingListComponent', () => {
  let addToShoppingListComponent: AddToShoppingListComponent;
  let addProductToShoppingListForm: FormGroup;
  let fixture: ComponentFixture<AddToShoppingListComponent>;
  let shoppingListFixture: ComponentFixture<ShoppingListListComponent>;
  let shoppingListComponent: ShoppingListListComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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

      declarations: [ AddToShoppingListComponent, SingleProductPageComponent, ShoppingListListComponent ],
      providers: [{ provide: PantryService, ProductService, useValue: new MockProductService() },
        { provide: MatDialogRef,useValue: []},
        { provide: MAT_DIALOG_DATA, useValue: [] },
        PantryProductsListComponent,
        ShoppingListListComponent,
        HttpClient,
        HttpHandler,
        ProductService]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
  });
}));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToShoppingListComponent);
    addToShoppingListComponent = fixture.componentInstance;
    shoppingListFixture = TestBed.createComponent(ShoppingListListComponent);
    shoppingListComponent = shoppingListFixture.componentInstance;
    /*addToShoppingListComponent.product = {
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
    };*/
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

  it('should create the component', () => {
    const dialogRef = shoppingListComponent.openAddDialog(
      {
        _id: 'milk_id',
        product_name: 'Whole Milk',
        description: '',
        brand: 'Land O Lakes',
        category: 'dairy',
        store: 'Pomme de Terre',
        location: '',
        notes: '',
        lifespan: 0,
        threshold: 0,
        image: ''
      }
      );
    expect(addToShoppingListComponent).toBeTruthy();
    expect(addProductToShoppingListForm).toBeTruthy();
  });

  it('The form should start with an empty quantity and be invalid', () => {
    expect(addProductToShoppingListForm.valid).toBeFalsy();
  });

  describe('Shopping item quantity field', () => {
    let pantryQuantityControl: AbstractControl;

    beforeEach(() => {
      pantryQuantityControl = addToShoppingListComponent.addToShoppingListForm.controls.quantity;
    });

    it('Should be able to add a quantity and be valid', () => {
      pantryQuantityControl.setValue(3);
      expect(addProductToShoppingListForm.valid).toBeTruthy();
    });

    it('Should not be able to add really large numbers', () => {
      pantryQuantityControl.setValue(999999999);
      expect(addProductToShoppingListForm.valid).toBeFalsy();
    });

    it('Should not be able to add non-integer characters', () => {
      pantryQuantityControl.setValue('BeaneBurrito');
      expect(addProductToShoppingListForm.valid).toBeFalsy();
    });
  });


});
