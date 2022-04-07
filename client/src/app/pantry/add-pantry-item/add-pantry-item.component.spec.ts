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
import { AddProductToPantryComponent } from 'src/app/products/add-product-to-pantry/add-product-to-pantry.component';
import { SingleProductPageComponent } from 'src/app/products/single-product-page/single-product-page.component';
import { PantryProductsListComponent } from 'src/app/pantry/pantry-products-list/pantry-products-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog, MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { AddPantryItemComponent } from './add-pantry-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockProductService } from 'src/testing/product.service.mock';

describe('AddPantryItemComponent', () => {
  let addPantryItemComponent: AddPantryItemComponent;
  let addProductToPantryForm: FormGroup;
  let fixture: ComponentFixture<AddPantryItemComponent>;

  beforeEach(async () => {
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
        MatDialogModule,
        HttpClientTestingModule
      ],
      declarations: [ AddPantryItemComponent ],
      providers: [{ provide: PantryService, useValue: new MockPantryService(), useProducts: new MockProductService() },
        PantryProductsListComponent,
        ProductService,
        MatDialog,]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPantryItemComponent);
    addPantryItemComponent = fixture.componentInstance;
    addPantryItemComponent.allProducts = MockProductService.testProducts;
    fixture.detectChanges();
    addPantryItemComponent.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(addPantryItemComponent).toBeTruthy();
  });

  describe('filter products on pantry page to add to pantry', () => {

    it('contains all the products', () => {
      expect(addPantryItemComponent.allProducts.length).toBe(3);
    });

    it('contains a product named \'banana\'', () => {
      expect(addPantryItemComponent.filterProducts('banana').length).toBe(1);
    });

    it('contains a product named \'bread\'', () => {
      expect(addPantryItemComponent.filterProducts('bread').length).toBe(1);
    });

    it('contains two products that have a \'b\' in them', () => {
      expect(addPantryItemComponent.filterProducts('b').length).toBe(2);
    });

  });
});
