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
}
