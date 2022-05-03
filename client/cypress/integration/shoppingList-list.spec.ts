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
