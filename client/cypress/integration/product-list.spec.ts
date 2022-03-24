import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();

describe('Product list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
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
