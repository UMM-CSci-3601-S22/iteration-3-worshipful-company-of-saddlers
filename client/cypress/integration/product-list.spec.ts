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
    // Filter for product Cake - Sheet Strawberry
    cy.get('[data-test=product_nameInput]').type('Cake - Sheet Strawberry');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cake - Sheet Strawberry')
      .should('not.contain.text', 'Apple - Delicious, Red')
      .should('not.contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something partial in the product name filter and check that it returned correct products', () => {
    // Filter for product Cake
    cy.get('[data-test=product_nameInput]').type('Cake');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cake - Sheet Strawberry')
      .should('not.contain.text', 'Apple - Delicious, Red')
      .should('contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something in the brand filter and check that it returned correct products', () => {
    // Filter for brand Treutel-Kunze
    cy.get('[data-test=productBrandInput]').type('Treutel-Kunze');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
      .should('contain.text', 'Treutel-Kunze')
      .should('not.contain.text', 'Erdman Group')
      .should('not.contain.text', 'Treutel-Howell');
  });

  it('Should type something partial in the brand filter and check that it returned correct products', () => {
    // Filter for brand Treutel
    cy.get('[data-test=productBrandInput]').type('Treutel');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
      .should('contain.text', 'Treutel-Kunze')
      .should('not.contain.text', 'Erdman Group')
      .should('contain.text', 'Treutel-Howell');
  });

  it('Should select a store filter and check that it returned correct products', () => {
    // Filter for store Willies
    page.selectStore('Willies');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product store name we are filtering by
    page.getFilteredProductListItems().find('.product-list-store')
      .should('contain.text', 'Willies')
      .should('not.contain.text', 'Pomme de Terre');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Appetizer - Assorted Box')
      .should('contain.text', 'Cookies - Amaretto')
      .should('not.contain.text', 'Cod - Salted, Boneless')
      .should('not.contain.text', 'Yogurt - Raspberry, 175 Gr');
  });

  it('Should select a category filter and check that it returned correct products', () => {
    // Filter for category Produce
    page.selectCategory('bakery');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product category we are filtering by
    page.getFilteredProductListItems().find('.product-list-category')
      .should('contain.text', 'bakery')
      .should('not.contain.text', 'produce')
      .should('not.contain.text', 'meat')
      .should('not.contain.text', 'dairy')
      .should('not.contain.text', 'frozen foods')
      .should('not.contain.text', 'canned goods')
      .should('not.contain.text', 'drinks')
      .should('not.contain.text', 'general')
      .should('not.contain.text', 'seasonal')
      .should('not.contain.text', 'miscellaneous');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'English Muffin')
      .should('contain.text', 'Horseradish Root')
      .should('not.contain.text', 'Assorted Desserts')
      .should('not.contain.text', 'Artichoke - Fresh');
  });

  describe('Produce product list works', () => {

    it('The produce products should be invisible by default', () => {
      // Before clicking on the button, the produce products should be hidden
      page.getProduceProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The produce products panel should show', () => {
      page.getProduceProductDropdown()
        .should('exist');
    });

    it('The produce product should appear and disappear when the panel is clicked', () => {
      page.getProduceProductDropdown().click();
      page.getProduceProductListItems().should('be.visible');
    });
  });

  describe('Bakery product list works', () => {

    it('The bakery products should be invisible by default', () => {
      // Before clicking on the button, the bakery products should be hidden
      page.getBakeryProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The bakery products panel should show', () => {
      page.getBakeryProductDropdown()
        .should('exist');
    });

    it('The bakery product should appear and disappear when the panel is clicked', () => {
      page.getBakeryProductDropdown().click();
      page.getBakeryProductListItems().should('be.visible');
    });
  });

  describe('Meat product list works', () => {

    it('The meat products should be invisible by default', () => {
      // Before clicking on the button, the meat products should be hidden
      page.getMeatProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The meat products panel should show', () => {
      page.getMeatProductDropdown()
        .should('exist');
    });

    it('The meat product should appear and disappear when the panel is clicked', () => {
      page.getMeatProductDropdown().click();
      page.getMeatProductListItems().should('be.visible');
    });
  });

  describe('Dairy product list works', () => {

    it('The dairy products should be invisible by default', () => {
      // Before clicking on the button, the dairy products should be hidden
      page.getDairyProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The dairy products panel should show', () => {
      page.getDairyProductDropdown()
        .should('exist');
    });

    it('The dairy product should appear and disappear when the panel is clicked', () => {
      page.getDairyProductDropdown().click();
      page.getDairyProductListItems().should('be.visible');
    });
  });

  describe('Drinks product list works', () => {

    it('The drink products should be invisible by default', () => {
      // Before clicking on the button, the drink products should be hidden
      page.getDrinkProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The drink products panel should show', () => {
      page.getDrinkProductDropdown()
        .should('exist');
    });

    it('The drink product should appear and disappear when the panel is clicked', () => {
      page.getDrinkProductDropdown().click();
      page.getDrinkProductListItems().should('be.visible');
    });
  });

  describe('Frozen food product list works', () => {

    it('The frozen food products should be invisible by default', () => {
      // Before clicking on the button, the frozen food products should be hidden
      page.getFrozenProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The frozen food products panel should show', () => {
      page.getFrozenProductDropdown()
        .should('exist');
    });

    it('The frozen food product should appear and disappear when the panel is clicked', () => {
      page.getFrozenProductDropdown().click();
      page.getFrozenProductListItems().should('be.visible');
    });
  });

  describe('Canned goods product list works', () => {

    it('The canned goods products should be invisible by default', () => {
      // Before clicking on the button, the canned goods products should be hidden
      page.getCannedProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The canned goods products panel should show', () => {
      page.getCannedProductDropdown()
        .should('exist');
    });

    it('The canned goods product should appear and disappear when the panel is clicked', () => {
      page.getCannedProductDropdown().click();
      page.getCannedProductListItems().should('be.visible');
    });
  });

  describe('General product list works', () => {

    it('The general products should be invisible by default', () => {
      // Before clicking on the button, the general products should be hidden
      page.getGeneralProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The general products panel should show', () => {
      page.getGeneralProductDropdown()
        .should('exist');
    });

    it('The general product should appear and disappear when the panel is clicked', () => {
      page.getGeneralProductDropdown().click();
      page.getGeneralProductListItems().should('be.visible');
    });
  });

  describe('Seasonal product list works', () => {

    it('The seasonal products should be invisible by default', () => {
      // Before clicking on the button, the seasonal products should be hidden
      page.getSeasonalProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The seasonal products panel should show', () => {
      page.getSeasonalProductDropdown()
        .should('exist');
    });

    it('The seasonal product should appear and disappear when the panel is clicked', () => {
      page.getSeasonalProductDropdown().click();
      page.getSeasonalProductListItems().should('be.visible');
    });
  });

  describe('Miscellaneous product list works', () => {

    it('The miscellaneous products should be invisible by default', () => {
      // Before clicking on the button, the miscellaneous products should be hidden
      page.getMiscellaneousProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('The miscellaneous products panel should show', () => {
      page.getMiscellaneousProductDropdown()
        .should('exist');
    });

    it('The miscellaneous product should appear and disappear when the panel is clicked', () => {
      page.getMiscellaneousProductDropdown().click();
      page.getMiscellaneousProductListItems().should('be.visible');
    });
  });
});
