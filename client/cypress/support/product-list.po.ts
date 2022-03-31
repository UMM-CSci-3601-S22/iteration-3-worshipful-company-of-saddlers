import { ProductCategory } from 'src/app/products/product';

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

  getFirstProduceDelete() {
    return cy.get('.produce-product-nav-list .deleteContainer').first();
  }

  getBakeryProductDropdown() {
    return cy.get('.bakery-product-expansion-panel');
  }

  getBakeryProductListItems() {
    return cy.get('.bakery-product-nav-list .product-list-item');
  }

  getFirstBakeryDelete() {
    return cy.get('.bakery-product-nav-list .deleteContainer').first();
  }

  getMeatProductDropdown() {
    return cy.get('.meat-product-expansion-panel');
  }

  getMeatProductListItems() {
    return cy.get('.meat-product-nav-list .product-list-item');
  }

  getFirstMeatDelete() {
    return cy.get('.meat-product-nav-list .deleteContainer').first();
  }

  getDairyProductDropdown() {
    return cy.get('.dairy-product-expansion-panel');
  }

  getDairyProductListItems() {
    return cy.get('.dairy-product-nav-list .product-list-item');
  }

  getFirstDairyDelete() {
    return cy.get('.dairy-product-nav-list .deleteContainer').first();
  }

  getDrinkProductDropdown() {
    return cy.get('.drink-product-expansion-panel');
  }

  getDrinkProductListItems() {
    return cy.get('.drink-product-nav-list .product-list-item');
  }

  getFirstDrinkDelete() {
    return cy.get('.drink-product-nav-list .deleteContainer').first();
  }

  getFrozenProductDropdown() {
    return cy.get('.frozen-product-expansion-panel');
  }

  getFrozenProductListItems() {
    return cy.get('.frozen-product-nav-list .product-list-item');
  }

  getFirstFrozenDelete() {
    return cy.get('.frozen-product-nav-list .deleteContainer').first();
  }

  getCannedProductDropdown() {
    return cy.get('.canned-product-expansion-panel');
  }

  getCannedProductListItems() {
    return cy.get('.canned-product-nav-list .product-list-item');
  }

  getFirstCannedDelete() {
    return cy.get('.canned-product-nav-list .deleteContainer').first();
  }

  getGeneralProductDropdown() {
    return cy.get('.general-product-expansion-panel');
  }

  getGeneralProductListItems() {
    return cy.get('.general-product-nav-list .product-list-item');
  }

  getFirstGeneralDelete() {
    return cy.get('.general-product-nav-list .deleteContainer').first();
  }

  getSeasonalProductDropdown() {
    return cy.get('.seasonal-product-expansion-panel');
  }

  getSeasonalProductListItems() {
    return cy.get('.seasonal-product-nav-list .product-list-item');
  }

  getFirstSeasonalDelete() {
    return cy.get('.seasonal-product-nav-list .deleteContainer').first();
  }

  getMiscellaneousProductDropdown() {
    return cy.get('.miscellaneous-product-expansion-panel');
  }

  getMiscellaneousProductListItems() {
    return cy.get('.miscellaneous-product-nav-list .product-list-item');
  }

  getFirstMiscellaneousDelete() {
    return cy.get('.miscellaneous-product-nav-list .deleteContainer').first();
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
