import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();

describe('Product list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  /*
  it('Product delete from the product dropdown works', () => {
    // Confirm that Beef - Tenderlion, Center Cut exists in the products page
    cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Beef - Tenderlion, Center Cut');

    // Open dropdown and delete item
    page.getProduceProductDropdown().click();
    page.getProduceProductListItems().find('.product-list-name').contains('Beef - Tenderlion, Center Cut');
    page.deleteProductInteraction();
    page.deleteProductDelete();

    cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
    page.getFilteredProductListItems().should('have.lengthOf', 0);
  });

  */

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

    // It takes too much time for the page to load, which causes the test
    // to fail since it times out after 4000ms. Having an e2e test can fix this solution.
    cy.wait(4000);

    page.getFilteredProductListItems().should('exist');
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

    page.getFilteredProductListItems().should('exist');
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
    it('The produce products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the produce products should be hidden
      page.getProduceProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getProduceProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the produce products should not be hidden
      page.getProduceProductDropdown().click();
      page.getProduceProductListItems().should('be.visible');
    });
  });

  describe('Bakery product list works', () => {
    it('The bakery products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the bakery products should be hidden
      page.getBakeryProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getBakeryProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the bakery products should not be hidden
      page.getBakeryProductDropdown().click();
      page.getBakeryProductListItems().should('be.visible');
    });
  });

  describe('Meat product list works', () => {
    it('The meat products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the meat products should be hidden
      page.getMeatProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getMeatProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the meat products should not be hidden
      page.getMeatProductDropdown().click();
      page.getMeatProductListItems().should('be.visible');
    });
  });

  describe('Dairy product list works', () => {
    it('The dairy products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the dairy products should be hidden
      page.getDairyProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getDairyProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the dairy products should not be hidden
      page.getDairyProductDropdown().click();
      page.getDairyProductListItems().should('be.visible');
    });
  });

  describe('Drinks product list works', () => {
    it('The drink products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the drink products should be hidden
      page.getDrinkProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getDrinkProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the drink products should not be hidden
      page.getDrinkProductDropdown().click();
      page.getDrinkProductListItems().should('be.visible');
    });
  });

  describe('Frozen food product list works', () => {
    it('The frozen food products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the frozen food products should be hidden
      page.getFrozenProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getFrozenProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the frozen food products should not be hidden
      page.getFrozenProductDropdown().click();
      page.getFrozenProductListItems().should('be.visible');
    });
  });

  describe('Canned goods product list works', () => {
    it('The canned goods products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the canned goods products should be hidden
      page.getCannedProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getCannedProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the canned goods products should not be hidden
      page.getCannedProductDropdown().click();
      page.getCannedProductListItems().should('be.visible');
    });
  });

  describe('General product list works', () => {
    it('The general products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the general products should be hidden
      page.getGeneralProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getGeneralProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the general products should not be hidden
      page.getGeneralProductDropdown().click();
      page.getGeneralProductListItems().should('be.visible');
    });
  });

  describe('Seasonal product list works', () => {
    it('The seasonal products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the seasonal products should be hidden
      page.getSeasonalProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getSeasonalProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the seasonal products should not be hidden
      page.getSeasonalProductDropdown().click();
      page.getSeasonalProductListItems().should('be.visible');
    });
  });

  describe('Miscellaneous product list works', () => {
    it('The miscellaneous products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the miscellaneous products should be hidden
      page.getMiscellaneousProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getMiscellaneousProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the miscellaneous products should not be hidden
      page.getMiscellaneousProductDropdown().click();
      page.getMiscellaneousProductListItems().should('be.visible');
    });
  });

  it('Should click add product and go to the right URL', () => {
    page.addProductButton().click();

    cy.url().should(url => expect(url.endsWith('/products/new')).to.be.true);

    cy.get('.add-product-title').should('have.text', 'Create a New Product');
  });
});
