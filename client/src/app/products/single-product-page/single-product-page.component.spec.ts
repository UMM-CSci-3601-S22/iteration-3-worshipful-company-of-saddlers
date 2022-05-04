import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { MockProductService } from 'src/testing/product.service.mock';
import { Product } from '../product';
import { ProductListComponent } from '../product-list/product-list.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { ProductService } from '../product.service';
import { SingleProductPageComponent } from './single-product-page.component';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('SingleProductPageComponent', () => {
  let component: SingleProductPageComponent;
  let fixture: ComponentFixture<SingleProductPageComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule
      ],
      declarations: [ SingleProductPageComponent, ProductListComponent ],
      providers: [
        { provide: ProductService, useValue: new MockProductService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific product profile/page', () => {
    const expectedProduct: Product = MockProductService.testProducts[0];
    activatedRoute.setParamMap({ id: expectedProduct._id});

    expect(component.id).toEqual(expectedProduct._id);
    expect(component.product).toEqual(expectedProduct);
  });

  it('should navigate to the correct product when the id parameter changes', () => {
    let expectedProduct: Product = MockProductService.testProducts[0];
    activatedRoute.setParamMap({ id: expectedProduct._id});
    expect(component.id).toEqual(expectedProduct._id);

    expectedProduct = MockProductService.testProducts[1];
    activatedRoute.setParamMap({ id: expectedProduct._id});
    expect(component.id).toEqual(expectedProduct._id);
  });

});
