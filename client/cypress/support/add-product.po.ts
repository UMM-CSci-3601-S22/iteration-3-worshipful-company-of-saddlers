import {Product} from 'src/app/products/product';

export class AddProductPage {
  navigateTo() {
    return cy.visit('/products/new');
  }

  getTitle() {
    return cy.get('.add-product-title');
  }

  addProductButton() {
    return cy.get('[data-test=confirmAddProductButton]');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addProduct(newProduct: Product) {
    this.getFormField('product_name').type(newProduct.product_name);
    if (newProduct.description) {
      this.getFormField('description').type(newProduct.description);
    }
    this.getFormField('brand').type(newProduct.brand);
    this.selectMatSelectValue(this.getFormField('category'), newProduct.category);
    this.getFormField('store').type(newProduct.store);
    if (newProduct.location) {
      this.getFormField('location').type(newProduct.location);
    }
    if (newProduct.notes) {
      this.getFormField('notes').type(newProduct.notes);
    }
    if (newProduct.lifespan) {
      this.getFormField('lifespan').type(newProduct.lifespan.toString());
    }
    if (newProduct.threshold) {
      this.getFormField('threshold').type(newProduct.threshold.toString());
    }
    if (newProduct.image) {
      this.getFormField('image').type(newProduct.image);
    }
    return this.addProductButton().click();
  }
}
