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
import { ProductService } from '../product.service';
import { AddProductToPantryComponent } from './add-product-to-pantry.component';
import { SingleProductPageComponent } from '../single-product-page/single-product-page.component';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('AddProductToPantryComponent', () => {
  let addProductToPantryComponent: AddProductToPantryComponent;
  let addProductToPantryForm: FormGroup;
  let fixture: ComponentFixture<AddProductToPantryComponent>;

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
      declarations: [ AddProductToPantryComponent, SingleProductPageComponent ],
      providers: [{ provide: PantryService, useValue: new MockPantryService() },
      PantryProductsListComponent,
      ProductService,
      HttpClient,
      HttpHandler,
      MatDialog,]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductToPantryComponent);
    addProductToPantryComponent = fixture.componentInstance;
    addProductToPantryComponent.product = {
      _id: 'banana_id',
      product_name: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Willies',
      location: '',
      notes: '',
      tags: [],
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
    addProductToPantryComponent.ngOnInit();
    fixture.detectChanges();
    addProductToPantryForm = addProductToPantryComponent.addToPantryForm;
    expect(addProductToPantryForm).toBeDefined();
    expect(addProductToPantryForm.controls).toBeDefined();
  });

  it('should create the component', () => {
    expect(addProductToPantryComponent).toBeTruthy();
    expect(addProductToPantryForm).toBeTruthy();
  });

  it('form should be valid on init (because datepicker defaults to todays date)', () => {
    expect(addProductToPantryForm.valid).toBeTruthy();
  });

  describe('Pantry Item Date field', () => {
    let pantry_dateControl: AbstractControl;

    beforeEach(() => {
      pantry_dateControl = addProductToPantryComponent.addToPantryForm.controls.purchase_date;
    });

    it('Should not allow and empty date', () => {
      pantry_dateControl.setValue('');
      expect(pantry_dateControl.valid).toBeFalsy();
    });
    /*Should not need these tests now that a datepicker is used and user cannot manually enter date text
    it('Should allow "01-02-2222"', () => {
      pantry_dateControl.setValue('01-02-2222');
      expect(pantry_dateControl.valid).toBeTruthy();
    });

    it('Should not allow a long date', () => {
      pantry_dateControl.setValue('011-02-2222');
      expect(pantry_dateControl.valid).toBeFalsy();
    });
    */
  });

  describe('Pantry Item Notes Field', () => {
    let pantry_notesControl: AbstractControl;

    beforeEach(() => {
      pantry_notesControl = addProductToPantryComponent.addToPantryForm.controls.notes;
    });

    it('should allow empty notes', () => {
      pantry_notesControl.setValue('');
      expect(pantry_notesControl.valid).toBeTruthy();
    });

    it('should not allow notes with more than 500 characters', () => {
      pantry_notesControl.setValue('abc'.repeat(500));
      expect(pantry_notesControl.valid).toBeFalsy();
    });

    it('should allow "notes for pantry item"', () => {
      pantry_notesControl.setValue('notes for pantry item');
      expect(pantry_notesControl.valid).toBeTruthy();
    });

    it('should allow numbers in notes', () => {
      pantry_notesControl.setValue('21 notes for 2 pantry items');
      expect(pantry_notesControl.valid).toBeTruthy();
    });
  });
});
