import { ProductCategory } from 'src/app/products/product';

export class ProductListPage {
  navigateTo() {
    return cy.visit('/products');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-nav-list .filtered-product-list-item');
  }

  getProduceProductDropdown() {
    return cy.get('.produce-product-expansion-panel');
  }

  getProduceProductListItems() {
    return cy.get('.produce-product-nav-list .product-list-item');
  }

  getBakeryProductDropdown() {
    return cy.get('.bakery-product-expansion-panel');
  }

  getBakeryProductListItems() {
    return cy.get('.bakery-product-nav-list .product-list-item');
  }

  getMeatProductDropdown() {
    return cy.get('.meat-product-expansion-panel');
  }

  getMeatProductListItems() {
    return cy.get('.meat-product-nav-list .product-list-item');
  }

  getDairyProductDropdown() {
    return cy.get('.dairy-product-expansion-panel');
  }

  getDairyProductListItems() {
    return cy.get('.dairy-product-nav-list .product-list-item');
  }

  getDrinkProductDropdown() {
    return cy.get('.drink-product-expansion-panel');
  }

  getDrinkProductListItems() {
    return cy.get('.drink-product-nav-list .product-list-item');
  }

  getFrozenProductDropdown() {
    return cy.get('.frozen-product-expansion-panel');
  }

  getFrozenProductListItems() {
    return cy.get('.frozen-product-nav-list .product-list-item');
  }

  getCannedProductDropdown() {
    return cy.get('.canned-product-expansion-panel');
  }

  getCannedProductListItems() {
    return cy.get('.canned-product-nav-list .product-list-item');
  }

  getGeneralProductDropdown() {
    return cy.get('.general-product-expansion-panel');
  }

  getGeneralProductListItems() {
    return cy.get('.general-product-nav-list .product-list-item');
  }

  getSeasonalProductDropdown() {
    return cy.get('.seasonal-product-expansion-panel');
  }

  getSeasonalProductListItems() {
    return cy.get('.seasonal-product-nav-list .product-list-item');
  }

  getMiscellaneousProductDropdown() {
    return cy.get('.miscellaneous-product-expansion-panel');
  }

  getMiscellaneousProductListItems() {
    return cy.get('.miscellaneous-product-nav-list .product-list-item');
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
  selectCategory(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=productCategorySelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  selectStore(value: string) {
    return cy.get('[data-test=productStoreSelect]').click().get(`mat-option[value="${value}"]`).click();
  }

  deleteProductInteraction() {
    return cy.get('[data-test=deleteProductButton]').click();
  }

  deleteProductCancel() {
    return cy.get('[data-test=cancelDeleteProductButton]').click();
  }

  addProductButton() {
    return cy.get('[data-test=addProductButton]');
  }
}
