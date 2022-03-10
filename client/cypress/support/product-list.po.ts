import { ProductCategory } from 'src/app/products/product';

export class ProductListPage {
  navigateTo() {
    return cy.visit('/products');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-nav-list .filtered-product-list-item');
  }

  getProduceProductListItems() {
    return cy.get('.produce-product-nav-list .product-list-item');
  }

  getBakeryProductListItems() {
    return cy.get('.bakery-product-nav-list .product-list-item');
  }

  getMeatProductListItems() {
    return cy.get('.meat-product-nav-list .product-list-item');
  }

  getDairyProductListItems() {
    return cy.get('.dairy-product-nav-list .product-list-item');
  }

  getDrinkProductListItems() {
    return cy.get('.drink-product-nav-list .product-list-item');
  }

  getFrozenProductListItems() {
    return cy.get('.frozen-product-nav-list .product-list-item');
  }

  getCannedProductListItems() {
    return cy.get('.canned-product-nav-list .product-list-item');
  }

  getGeneralProductListItems() {
    return cy.get('.general-product-nav-list .product-list-item');
  }

  getSeasonalProductListItems() {
    return cy.get('.seasonal-product-nav-list .product-list-item');
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
  selectCategory(value: ProductCategory) {
    // Find and click the drop down
    return cy.get('[data-test=productCategorySelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  deleteProductInteraction(cssClass: string) {
    return cy.get(cssClass + ' ' + '[data-test=deleteProductButton]');
  }
}
