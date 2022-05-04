import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  describe('The sidenav should open, navigate to "Products" and back to "Pantry"', () => {

    it('The toolbar buttons should exist', () => {
      cy.get('.toolbar').should('be.visible');
      cy.get('.toolbar .toolbar-item').should('be.visible');
    });

    it('The navigation to pantry works', () => {
      cy.get('.toolbar-item').eq(0).click();
      cy.url().should('match', /\/$/);
    });

    it('The navigation to products works', () => {
      cy.get('.toolbar-item').eq(1).click();
      cy.url().should('match', /\/products$/);
    });

    it('The navigation to shoppingList works', () => {
      cy.get('.toolbar-item').eq(2).click();
      cy.url().should('match', /\/shoppingList$/);
    });
  });
});
