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

  getBakedGoodsProductDropdown() {
    return cy.get('.baked-goods-product-expansion-panel');
  }

  getBakedGoodsProductListItems() {
    return cy.get('.baked-goods-product-nav-list .product-list-item');
  }

  getFirstBakedGoodsDelete() {
    return cy.get('.baked-goods-product-nav-list .deleteContainer').first();
  }

  getBakingSuppliesProductDropdown() {
    return cy.get('.baking-supplies-product-expansion-panel');
  }

  getBakingSuppliesProductListItems() {
    return cy.get('.baking-supplies-product-nav-list .product-list-item');
  }

  getBakingSuppliesDelete() {
    return cy.get('.baking-supplies-product-nav-list .deleteContainer').first();
  }

  getBeverageProductDropdown() {
    return cy.get('.beverage-supplies-product-expansion-panel');
  }

  getBeverageProductListItems() {
    return cy.get('.beverage-supplies-product-nav-list .product-list-item');
  }

  getBeverageDelete() {
    return cy.get('.beverage-supplies-product-nav-list .deleteContainer').first();
  }

  getCleaningProductDropdown() {
    return cy.get('.cleaning-supplies-product-expansion-panel');
  }

  getCleaningProductListItems() {
    return cy.get('.cleaning-supplies-product-nav-list .product-list-item');
  }

  getCleaningDelete() {
    return cy.get('.cleaning-supplies-product-nav-list .deleteContainer').first();
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

  getDeliProductDropdown() {
    return cy.get('.deli-product-expansion-panel');
  }

  getDeliProductListItems() {
    return cy.get('.deli-product-nav-list .product-list-item');
  }

  getFirstDeliDelete() {
    return cy.get('.deli-product-nav-list .deleteContainer').first();
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

  getHerbProductDropdown() {
    return cy.get('.herb-product-expansion-panel');
  }

  getHerbProductListItems() {
    return cy.get('.herb-product-nav-list .product-list-item');
  }

  getFirstHerbDelete() {
    return cy.get('.herb-product-nav-list .deleteContainer').first();
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

  getMiscellaneousProductDropdown() {
    return cy.get('.miscellaneous-product-expansion-panel');
  }

  getMiscellaneousProductListItems() {
    return cy.get('.miscellaneous-product-nav-list .product-list-item');
  }

  getFirstMiscellaneousDelete() {
    return cy.get('.miscellaneous-product-nav-list .deleteContainer').first();
  }

  getPaperProductDropdown() {
    return cy.get('.paper-product-expansion-panel');
  }

  getPaperProductListItems() {
    return cy.get('.paper-product-nav-list .product-list-item');
  }

  getFirstPaperDelete() {
    return cy.get('.paper-product-nav-list .deleteContainer').first();
  }

  getPetProductDropdown() {
    return cy.get('.pet-supplies-product-expansion-panel');
  }

  getPetProductListItems() {
    return cy.get('.pet-supplies-product-nav-list .product-list-item');
  }

  getFirstPetDelete() {
    return cy.get('.pet-supplies-product-nav-list .deleteContainer').first();
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

  getStapleProductDropdown() {
    return cy.get('.staple-product-expansion-panel');
  }

  getStapleProductListItems() {
    return cy.get('.staple-product-nav-list .product-list-item');
  }

  getStapleProduceDelete() {
    return cy.get('.staple-product-nav-list .deleteContainer').first();
  }

  getToiletriesProductDropdown() {
    return cy.get('.toiletries-product-expansion-panel');
  }

  getToiletriesProductListItems() {
    return cy.get('.toiletries-product-nav-list .product-list-item');
  }

  getFirstToiletriesDelete() {
    return cy.get('.toiletries-product-nav-list .deleteContainer').first();
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
