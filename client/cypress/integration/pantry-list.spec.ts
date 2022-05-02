import { PantryListPage } from '../support/pantry-list.po';

const page = new PantryListPage();

describe('Pantry list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  describe('Filtered product dropdown functions work', () => {

    it('All and filtered pantry item dropdown works', () => {
      // Before clicking on the button, the cleaning products should be hidden
      page.getFilteredPantryListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getFilteredPantryDropdown()
        .should('exist');
      // After clicking the dropdown panel, the cleaning products should not be hidden
      page.getFilteredPantryDropdown().click();
      page.getFilteredPantryListItems().should('be.visible');
      // After clicking the dropdown panel again, the items should be hidden
      page.getFilteredPantryDropdown().click();
      page.getFilteredPantryListItems()
      .should('be.hidden')
      .and('not.be.visible');
    });

    it('Should type something in the name filter and check that it returned correct items', () => {
      // Open pantry item dropdown
      page.getFilteredPantryDropdown().click();

      // Check that multiple items are in the pantry
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza')
        .should('contain.text', 'Flour - Chickpea')
        .should('contain.text', 'Fudge - Cream Fudge');

      // Filter for item: Cheese Pizza
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().should('have.lengthOf.above', 0);

      // All returned filtered items should have the item name we are filtering by
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza')
        .should('not.contain.text', 'Flour - Chickpea')
        .should('not.contain.text', 'Fudge - Cream Fudge');
    });

    it('Should type something partial in the name filter and check that it returned correct items', () => {
      // Open pantry item dropdown
      page.getFilteredPantryDropdown().click();

      // Check that multiple items are in the pantry
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza')
        .should('contain.text', 'Flour - Chickpea')
        .should('contain.text', 'Fudge - Cream Fudge');

      // Filter for item: Cheese Pizza
      cy.get('[data-test=pantry_nameInput]').type('Ch');
      page.getFilteredPantryListItems().should('have.lengthOf.above', 0);

      // All returned filtered items should have the item name we are filtering by
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza')
        .should('contain.text', 'Flour - Chickpea')
        .should('not.contain.text', 'Fudge - Cream Fudge');
    });

    it('Pantry delete cancel from filtering works', () => {
      // Open pantry item dropdown
      page.getFilteredPantryDropdown().click();

      // Confirm that Cheese Pizza exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza');

      // Open dropdown and delete item
      page.getFirstFilterDelete().click();
      cy.window().should('exist');
      cy.get(':nth-child(1) > .mat-dialog-actions > :nth-child(2) > .mat-focus-indicator').click();

      // Confirm that Cheese Pizza still exists in the products page
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
    });

    it('Pantry delete from multiple of pantry item filtering works', () => {
      // Open pantry item dropdown
      page.getFilteredPantryDropdown().click();

      // Confirm that Cheese Pizza exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 4);

      // Open dropdown and delete item
      page.getFirstFilterDelete().click();
      cy.window().should('exist');
      cy.get(':nth-child(1) > .mat-dialog-actions > [style="padding-top: 5px;"] > .mat-focus-indicator').click();

      // Confirm that Cheese Pizza still exists in the pantry page
      page.navigateTo();
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity').should('contain.text', 3);
    });

    it('Pantry delete from a singular pantry item filtering works', () => {
      // Open pantry item dropdown
      page.getFilteredPantryDropdown().click();

      // Confirm that Flour - Chickpea exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Flour - Chickpea');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Flour - Chickpea');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 1);

      // Open dropdown and delete item
      page.getFirstFilterDelete().click();
      cy.window().should('exist');
      cy.get(':nth-child(1) > .mat-dialog-actions > [style="padding-top: 5px;"] > .mat-focus-indicator').click();

      // Confirm that Flour - Chickpea no longer exists in the pantry page
      page.navigateTo();
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Flour - Chickpea');
      page.getFilteredPantryListItems().should('have.lengthOf', 0);
    });
  });
});
