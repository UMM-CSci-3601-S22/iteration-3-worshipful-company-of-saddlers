import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();

describe('Product list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  /* Product Delete possible format

  it('Product delete from the product dropdown works', () => {
    // Confirm that Beef - Tenderlion, Center Cut exists in the products page
    cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Beef - Tenderlion, Center Cut');

    // Open dropdown and delete item
    page.getProduceProductDropdown().click();
    page.getProduceProductListItems().first().find('.produce-product-nav-list').click();
    page.deleteProductDelete();

    // Confirm that Beef - Tenderlion, Center Cut no longer exists in the products page
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
    // to fail since it times out after 4000ms. Having cypress wait for 4
    // seconds catches the system up to confirm the assertions without timing out
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

  it('Should click filtered product and go to the right URL', () => {
    // Get Beef - Tenderlion, Center Cut
    cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
    page.getFilteredProductListItems().first().then((list) => {
      const firstProductName = list.find('.product-list-name').text().trim();
      const firstProductCategory = list.find('.product-list-category').text().trim();

      page.getFilteredProductListItems().first().click();

      // The URL should be '/products/' followed by a mongo ID
      cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and category should be correct
      cy.get('.product-card-name').should('have.text', firstProductName);
      cy.get('.product-card-category').first().should('have.text', firstProductCategory);

    });
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
      // After clicking the dropdown panel again, the produce product should not be hidden
      page.getProduceProductDropdown().click();
      page.getProduceProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the bakery product should not be hidden
      page.getBakeryProductDropdown().click();
      page.getBakeryProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the meat product should not be hidden
      page.getMeatProductDropdown().click();
      page.getMeatProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the dairy product should not be hidden
      page.getDairyProductDropdown().click();
      page.getDairyProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the drink product should not be hidden
      page.getDrinkProductDropdown().click();
      page.getDrinkProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the frozen food product should not be hidden
      page.getFrozenProductDropdown().click();
      page.getFrozenProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the canned goods product should not be hidden
      page.getCannedProductDropdown().click();
      page.getCannedProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the general product should not be hidden
      page.getGeneralProductDropdown().click();
      page.getGeneralProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the seasonal product should not be hidden
      page.getSeasonalProductDropdown().click();
      page.getSeasonalProductListItems().should('not.be.visible');
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
      // After clicking the dropdown panel again, the miscellaneous product should not be hidden
      page.getMiscellaneousProductDropdown().click();
      page.getMiscellaneousProductListItems().should('not.be.visible');
    });
  });

  it('Should click add product and go to the right URL', () => {
    page.addProductButton().click();

    cy.url().should(url => expect(url.endsWith('/products/new')).to.be.true);

    cy.get('.add-product-title').should('have.text', 'Create a New Product');
  });
});
