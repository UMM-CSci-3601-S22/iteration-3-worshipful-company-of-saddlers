import { PantryListPage } from '../support/pantry-list.po';

const page = new PantryListPage();

describe('Pantry list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

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
});
