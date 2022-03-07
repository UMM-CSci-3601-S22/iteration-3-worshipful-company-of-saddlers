import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductPageComponent } from './single-product-page.component';

describe('SingleProductPageComponent', () => {
  let component: SingleProductPageComponent;
  let fixture: ComponentFixture<SingleProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
