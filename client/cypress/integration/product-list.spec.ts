import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();

describe('Product list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('No filtered products should exist if nothing has been filtered', () => {
    page.getFilteredProductListItems()
      .should('not.exist');
  });

  it('Should type something in the product name filter and check that it returned correct products', () => {
    // Filter for product Shrimp - Black Tiger 13/15
    cy.get('[data-test=product_nameInput]').type('Lettuce');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Lettuce')
      .should('not.contain.text', 'Shrimp - 16/20, Iqf, Shell On')
      .should('not.contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something partial in the product name filter and check that it returned correct products', () => {
    // Filter for product Shrimp
    cy.get('[data-test=product_nameInput]').type('lett');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
    .should('contain.text', 'Lettuce')
    .should('not.contain.text', 'Shrimp - 16/20, Iqf, Shell On')
    .should('not.contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something in the brand filter and check that it returned correct products', () => {
    // Filter for brand Kozey, Rowe and Krajcik
    cy.get('[data-test=productBrandInput]').type('local farmers');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
      .should('contain.text', 'local farmers')
      .should('not.contain.text', 'Rowe and Sons')
      .should('not.contain.text', 'Treutel-Howell');
  });

  it('Should type something partial in the brand filter and check that it returned correct products', () => {
    // Filter for brand Rowe
    cy.get('[data-test=productBrandInput]').type('local ');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
    .should('contain.text', 'local farmers')
    .should('not.contain.text', 'Rowe and Sons')
    .should('not.contain.text', 'Treutel-Howell');
  });

  it('Should select a store filter and check that it returned correct products', () => {
    // Filter for store Willies
    page.selectStore('Willies');

    // It takes too much time for the page to load, which causes the test
    // to fail since it times out after 4000ms. Having cypress wait for 4
    // seconds catches the system up to confirm the assertions without timing out
    cy.wait(1000);

    page.getFilteredProductListItems().should('exist');
    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product store name we are filtering by
    page.getFilteredProductListItems().find('.product-list-store')
      .should('contain.text', 'Willies');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cheese Pizza')
      .should('contain.text', 'Distilled Water')
      .should('not.contain.text', 'Muffin Hinge 117n')
      .should('not.contain.text', 'Sprouts - Bean');
  });

  it('Should select a category filter and check that it returned correct products', () => {
    // Filter for category Produce
    // page.selectCategory('Produce');
    cy.get('[data-test=productCategorySelect]').click().get(`#mat-option-19 > .mat-option-text`).click();
    page.getFilteredProductListItems().should('exist');
    // All returned filtered products should have the product category we are filtering by
    page.getFilteredProductListItems().find('.product-list-category')
      .should('contain.text', 'produce')
      .should('not.contain.text', 'baking supplies')
      .should('not.contain.text', 'beverage')
      .should('not.contain.text', 'cleaning supplies')
      .should('not.contain.text', 'dairy')
      .should('not.contain.text', 'deli')
      .should('not.contain.text', 'frozen foods')
      .should('not.contain.text', 'herbs and spices')
      .should('not.contain.text', 'meat')
      .should('not.contain.text', 'miscellaneous')
      .should('not.contain.text', 'paper products')
      .should('not.contain.text', 'pet supplies')
      .should('not.contain.text', 'baked goods')
      .should('not.contain.text', 'staple')
      .should('not.contain.text', 'toiletries');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Lettuce')
      .should('contain.text', 'Mandarin Oranges')
      .should('not.contain.text', 'Muffin Puck Ww Carrot')
      .should('not.contain.text', 'Bread - White, Unsliced');
  });

  it('Should click filtered product and go to the right URL', () => {
    // Get Bread - White, Unsliced
    cy.get('[data-test=product_nameInput]').type('lettuce');
    page.getFilteredProductListItems().first().then((list) => {
      const firstProductName = list.find('.product-list-name').text().trim();

      page.getFilteredProductListItems().first().click();

      // The URL should be '/products/' followed by a mongo ID
      cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name should be correct
      cy.get('[data-test="product_nameInput"]').should('have.value', firstProductName);
    });
  });

  it('Product delete cancel from filtering works', () => {
    // Confirm that Cheese Pizza exists in the products page
    cy.get('[data-test=product_nameInput]').type('Cheese Pizza');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cheese Pizza');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

    // Confirm that Cheese Pizza still exists in the products page
    page.getFilteredProductListItems().should('have.lengthOf', 1);
  });

  it('Product delete from filtering works', () => {
    // Confirm that Cheese Pizza exists in the products page
    cy.get('[data-test=product_nameInput]').type('Cheese Pizza');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cheese Pizza');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('.mat-warn > .mat-button-wrapper').click();

    // Confirm that Cheese Pizza no longer exists in the products page
    page.getFilteredProductListItems().should('have.lengthOf', 0);
  });

});
