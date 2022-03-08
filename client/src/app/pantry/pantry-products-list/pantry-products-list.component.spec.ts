import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryProductsListComponent } from './pantry-products-list.component';

describe('PantryProductsListComponent', () => {
  let component: PantryProductsListComponent;
  let fixture: ComponentFixture<PantryProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantryProductsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
