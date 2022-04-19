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
import { MockProductService } from 'src/testing/product.service.mock';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../product.service';

describe('AddProductComponent', () => {
  let addProductComponent: AddProductComponent;
  let addProductForm: FormGroup;
  let fixture: ComponentFixture<AddProductComponent>;

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
        RouterTestingModule
      ],
      declarations: [ AddProductComponent ],
      providers: [{ provide: ProductService, useValue: new MockProductService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    addProductComponent = fixture.componentInstance;
    addProductComponent.ngOnInit();
    fixture.detectChanges();
    addProductForm = addProductComponent.addProductForm;
    expect(addProductForm).toBeDefined();
    expect(addProductForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addProductComponent).toBeTruthy();
    expect(addProductForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addProductForm.valid).toBeFalsy();
  });

  describe('The product name field', () => {
    let product_nameControl: AbstractControl;

    beforeEach(() => {
      product_nameControl = addProductComponent.addProductForm.controls.product_name;
    });

    it('should not allow empty product names', () => {
      product_nameControl.setValue('');
      expect(product_nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Apple"', () => {
      product_nameControl.setValue('Apple');
      expect(product_nameControl.valid).toBeTruthy();
    });

    it('should allow single character product names', () => {
      product_nameControl.setValue('x');
      expect(product_nameControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      product_nameControl.setValue('x'.repeat(2000));
      expect(product_nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(product_nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      product_nameControl.setValue('Apll3');
      expect(product_nameControl.valid).toBeTruthy();
    });
  });

  describe('The product description field', () => {
    let descriptionControl: AbstractControl;

    beforeEach(() => {
      descriptionControl = addProductComponent.addProductForm.controls.description;
    });

    it('should allow empty product description', () => {
      descriptionControl.setValue('');
      expect(descriptionControl.valid).toBeTruthy();
    });

    it('should be fine with "description of item"', () => {
      descriptionControl.setValue('description of item');
      expect(descriptionControl.valid).toBeTruthy();
    });

    it('should allow single character product description', () => {
      descriptionControl.setValue('x');
      expect(descriptionControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long descriptions', () => {
      descriptionControl.setValue('x'.repeat(2000));
      expect(descriptionControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(descriptionControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the description', () => {
      descriptionControl.setValue('d3scr1pt10n');
      expect(descriptionControl.valid).toBeTruthy();
    });
  });

  describe('The product brand field', () => {
    let brandControl: AbstractControl;

    beforeEach(() => {
      brandControl = addProductComponent.addProductForm.controls.brand;
    });

    it('should not allow empty brand', () => {
      brandControl.setValue('');
      expect(brandControl.valid).toBeFalsy();
    });

    it('should be fine with "brand of item"', () => {
      brandControl.setValue('brand of item');
      expect(brandControl.valid).toBeTruthy();
    });

    it('should allow single character product brand', () => {
      brandControl.setValue('x');
      expect(brandControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long brand', () => {
      brandControl.setValue('x'.repeat(2000));
      expect(brandControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(brandControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the brand', () => {
      brandControl.setValue('br4nd');
      expect(brandControl.valid).toBeTruthy();
    });
  });

  describe('The category field', () => {
    let categoryControl: AbstractControl;

    beforeEach(() => {
      categoryControl = addProductForm.controls.category;
    });

    it('should not allow empty values', () => {
      categoryControl.setValue('');
      expect(categoryControl.valid).toBeFalsy();
      expect(categoryControl.hasError('required')).toBeTruthy();
    });

    it('should allow "baked goods"', () => {
      categoryControl.setValue('baked goods');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should allow "produce"', () => {
      categoryControl.setValue('produce');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should allow "meat"', () => {
      categoryControl.setValue('meat');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should not allow "Supreme Overlord"', () => {
      categoryControl.setValue('Supreme Overlord');
      expect(categoryControl.valid).toBeFalsy();
    });
  });

  describe('The product store field', () => {
    let storeControl: AbstractControl;

    beforeEach(() => {
      storeControl = addProductComponent.addProductForm.controls.store;
    });

    it('should not allow empty store', () => {
      storeControl.setValue('');
      expect(storeControl.valid).toBeFalsy();
    });

    it('should be fine with "store of item"', () => {
      storeControl.setValue('store of item');
      expect(storeControl.valid).toBeTruthy();
    });

    it('should allow single character product store', () => {
      storeControl.setValue('x');
      expect(storeControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long store', () => {
      storeControl.setValue('x'.repeat(2000));
      expect(storeControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(storeControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the store', () => {
      storeControl.setValue('st0r3');
      expect(storeControl.valid).toBeTruthy();
    });
  });

  describe('The product location field', () => {
    let locationControl: AbstractControl;

    beforeEach(() => {
      locationControl = addProductComponent.addProductForm.controls.location;
    });

    it('should allow empty store', () => {
      locationControl.setValue('');
      expect(locationControl.valid).toBeTruthy();
    });

    it('should be fine with "location of item"', () => {
      locationControl.setValue('location of item');
      expect(locationControl.valid).toBeTruthy();
    });

    it('should allow single character product location', () => {
      locationControl.setValue('x');
      expect(locationControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long location', () => {
      locationControl.setValue('x'.repeat(2000));
      expect(locationControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(locationControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the location', () => {
      locationControl.setValue('aisle 32');
      expect(locationControl.valid).toBeTruthy();
    });
  });

  describe('The product notes field', () => {
    let notesControl: AbstractControl;

    beforeEach(() => {
      notesControl = addProductComponent.addProductForm.controls.notes;
    });

    it('should allow empty notes', () => {
      notesControl.setValue('');
      expect(notesControl.valid).toBeTruthy();
    });

    it('should be fine with "notes of item"', () => {
      notesControl.setValue('notes of item');
      expect(notesControl.valid).toBeTruthy();
    });

    it('should allow single character product notes', () => {
      notesControl.setValue('x');
      expect(notesControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long notes', () => {
      notesControl.setValue('x'.repeat(2000));
      expect(notesControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(notesControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the notes', () => {
      notesControl.setValue('note5 25 beatiful notes');
      expect(notesControl.valid).toBeTruthy();
    });
  });
  describe('The lifespan field', () => {
    let lifespanControl: AbstractControl;

    beforeEach(() => {
      lifespanControl = addProductComponent.addProductForm.controls.lifespan;
    });

    it('should allow empty lifespan', () => {
      lifespanControl.setValue('');
      expect(lifespanControl.valid).toBeTruthy();
    });

    it('should be fine with "27"', () => {
      lifespanControl.setValue('27');
      expect(lifespanControl.valid).toBeTruthy();
    });

    it('should fail on negative ages', () => {
      lifespanControl.setValue('-27');
      expect(lifespanControl.valid).toBeFalsy();
      expect(lifespanControl.hasError('min')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like ages.
    it('should fail on lifespans that are too high', () => {
      lifespanControl.setValue(2000000);
      expect(lifespanControl.valid).toBeFalsy();
      // I have no idea why I have to use a lower case 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      // But I apparently do.
      expect(lifespanControl.hasError('max')).toBeTruthy();
    });

    it('should not allow an lifespan to contain a decimal point', () => {
      lifespanControl.setValue(27.5);
      expect(lifespanControl.valid).toBeFalsy();
      expect(lifespanControl.hasError('pattern')).toBeTruthy();
    });
  });

  describe('The threshold field', () => {
    let thresholdControl: AbstractControl;

    beforeEach(() => {
      thresholdControl = addProductComponent.addProductForm.controls.threshold;
    });

    it('should allow empty threshold', () => {
      thresholdControl.setValue('');
      expect(thresholdControl.valid).toBeTruthy();
    });

    it('should be fine with "27"', () => {
      thresholdControl.setValue('27');
      expect(thresholdControl.valid).toBeTruthy();
    });

    it('should fail on negative ages', () => {
      thresholdControl.setValue('-27');
      expect(thresholdControl.valid).toBeFalsy();
      expect(thresholdControl.hasError('min')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like ages.
    it('should fail on threshold that are too high', () => {
      thresholdControl.setValue(2000000);
      expect(thresholdControl.valid).toBeFalsy();
      // I have no idea why I have to use a lower case 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      // But I apparently do.
      expect(thresholdControl.hasError('max')).toBeTruthy();
    });

    it('should not allow an threshold to contain a decimal point', () => {
      thresholdControl.setValue(27.5);
      expect(thresholdControl.valid).toBeFalsy();
      expect(thresholdControl.hasError('pattern')).toBeTruthy();
    });
  });
});
