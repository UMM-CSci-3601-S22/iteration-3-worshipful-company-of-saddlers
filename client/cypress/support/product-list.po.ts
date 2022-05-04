
export class ProductListPage {
  navigateTo() {
    return cy.visit('/products');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-nav-list .filtered-product-list-item');
  }

  getFirstFilterDelete() {
    return cy.get('.filtered-product-nav-list .deleteContainer').first();
  }

  getProduceProductDropdown() {
    return cy.get('.produce-product-expansion-panel');
  }

  getProduceProductListItems() {
    return cy.get('.produce-product-nav-list .product-list-item');
  }

  getFirstProduceProductDelete() {
    return cy.get('.produce-product-nav-list .deleteContainer').first();
  }

  /**
   * Clicks the product nav-item 'link'
   *
   * @param navItem The user card
   */
  /* clickViewProfile(navItem: Cypress.Chainable<JQuery<HTMLElement>>) {
    return navItem.find<HTMLButtonElement>('[data-test=viewProfileButton]').click();
  } */

  /**
   * Selects a category to filter in the "Category" selector.
   *
   * @param value The category *value* to select, this is what's found in the mat-option "value" attribute.
   */

  selectStore(value: string) {
    return cy.get('[data-test=productStoreSelect]')
    // Select and click the desired value from the resulting menu
    .click().get(`mat-option[value="${value}"]`).click();
  }

  deleteProductDelete() {
    return cy.get('[data-test=finalDeleteProductButton]').click();
  }

  deleteProductCancel() {
    return cy.get('[data-test=cancelDeleteProductButton]').click();
  }

  addProductButton() {
    return cy.get('[data-test=addProductButton]');
  }
}
