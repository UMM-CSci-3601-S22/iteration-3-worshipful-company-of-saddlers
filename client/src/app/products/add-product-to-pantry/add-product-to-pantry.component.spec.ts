import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToPantryComponent } from './add-product-to-pantry.component';

describe('AddProductToPantryComponent', () => {
  let component: AddProductToPantryComponent;
  let fixture: ComponentFixture<AddProductToPantryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductToPantryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductToPantryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
