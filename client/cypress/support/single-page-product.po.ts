import { ProductCategory } from 'src/app/products/product';

export class SingleProductPage {

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }
}
