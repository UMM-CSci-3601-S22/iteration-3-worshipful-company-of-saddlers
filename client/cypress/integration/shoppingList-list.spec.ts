import { ShoppingListListComponent } from '../support/shoppingList-list.po';

const page = new ShoppingListListComponent();


describe('Should be able to add product to the shopping list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    // Navigate to products page
    page.navigateToProductPage();
  });

  it ('Should definitely be able to add a product to the shopping list', () => {
    cy.get('[data-test=product_nameInput]').type('r');
    page.getFilteredProductListItems().first().then((list) => {
      const addedProduct = list.find('.product-list-name').text().trim();
      page.getFilteredProductListItems().first().click();

    cy.get('[data-test="addToShoppingListButton"]').click();
    page.getFormField('quantity').type('4');
    cy.get('[data-test="confirmAddProductToPantryButton"]').click();
    //page.navigateToShoppingList();
    cy.get('.shoppingList-list').should('contain.text', addedProduct);
    });
  });
});

describe('Should be able to generate the shopping list & remove items from it', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    // Navigate to products page
    page.navigateToShoppingList();
  });

  it('Should be able to generate the shoppingList', () => {
    cy.wait(2000);
    cy.get('[data-test="addToShoppingListButton"]').click();
    page.getShoppingListItems().find('.shoppingList-list-name')
      .should('contain.text', 'Distilled Water');
  });

  it('Should be able to remove from the shopping list', () => {
    // const len = page.getShoppingListItems().its('');
    let len: number;
    page.getShoppingListItems().its('length').then(($btn) => {
      len = $btn.valueOf();
      page.getShoppingListItems().its('length').should('eq', len);
      page.getShoppingListItems().first()
      .get('[data-test="deleteItemButton"]').first().click().get('[data-test="confirmRemove"]').click();
      cy.wait(500);
      page.getShoppingListItems().its('length').should('eq', len-1);
    });
  });
});
