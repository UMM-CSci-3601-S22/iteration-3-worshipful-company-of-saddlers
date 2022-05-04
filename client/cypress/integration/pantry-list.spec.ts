import { PantryListPage } from '../support/pantry-list.po';
import { ProductListPage } from 'cypress/support/product-list.po';
import { SingleProductPage } from 'cypress/support/single-page-product.po';

const page = new PantryListPage();
const productPage = new ProductListPage();
const singlePage = new SingleProductPage();

describe('Pantry list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  describe('Filtered product dropdown functions work', () => {

    it('All and filtered pantry item dropdown works', () => {
      // Before clicking on the button, the items should be hidden
      page.getFilteredPantryListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getFilteredPantryDropdown()
        .should('exist');
      // After clicking the dropdown panel, the items should not be hidden
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
      page.cancelDeletePantryItem();

      // Confirm that Cheese Pizza still exists in the products page
      page.navigateTo();
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity').should('contain.text', 4);
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
      page.deleteFirstPantryItem();

      // Confirm that Cheese Pizza still exists in the pantry page
      page.navigateTo();
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza');
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
      page.deleteFirstPantryItem();

      // Confirm that Flour - Chickpea no longer exists in the pantry page
      page.navigateTo();
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Flour - Chickpea');
      page.getFilteredPantryListItems().should('have.lengthOf', 0);
    });
  });

  describe('Category dropdown functions work', () => {

    it('Pantry item dropdown works', () => {
      // Before clicking on the button, the deli items should be hidden
      page.getDeliPantryListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getDeliPantryDropdown()
        .should('exist');
      // After clicking the dropdown panel, the deli items should not be hidden
      page.getDeliPantryDropdown().click();
      page.getDeliPantryListItems().should('be.visible');
      // After clicking the dropdown panel again, the items should be hidden
      page.getDeliPantryDropdown().click();
      page.getDeliPantryListItems()
      .should('be.hidden')
      .and('not.be.visible');
    });

    it('Pantry delete cancel from category dropdown works', () => {
      // Open deli pantry item dropdown
      page.getDeliPantryDropdown().click();

      // Confirm that Eggplant - Regular exists in the pantry page
      page.getDeliPantryListItems().should('have.lengthOf', 1);
      page.getDeliPantryListItems().find('.product-list-name')
        .should('contain.text', 'Eggplant - Regular');
      page.getDeliPantryListItems().find('.pantryItem-list-quantity').should('contain.text', 2);

      // Open dropdown and delete item
      page.getFirstDeliDelete().click();
      cy.window().should('exist');
      page.cancelDeletePantryItem();

      // Confirm that Eggplant - Regular still exists in the products page
      page.navigateTo();
      page.getDeliPantryListItems().should('have.lengthOf', 1);
      page.getDeliPantryListItems().find('.product-list-name')
        .should('contain.text', 'Eggplant - Regular');
      page.getDeliPantryListItems().find('.pantryItem-list-quantity').should('contain.text', 2);
    });

    it('Pantry delete from multiple of category pantry item works', () => {
      // Open pantry item dropdown
      page.getDeliPantryDropdown().click();

      // Confirm that Eggplant - Regular exists in the pantry page
      page.getDeliPantryListItems().should('have.lengthOf', 1);
      page.getDeliPantryListItems().find('.product-list-name')
        .should('contain.text', 'Eggplant - Regular');
      page.getDeliPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 2);

      // Open dropdown and delete item
      page.getFirstDeliDelete().click();
      cy.window().should('exist');
      page.deleteFirstPantryItem();

      // Confirm that Eggplant - Regular still exists in the pantry page
      page.navigateTo();
      page.getDeliPantryDropdown().click();
      page.getDeliPantryListItems().find('.product-list-name')
        .should('contain.text', 'Eggplant - Regular');
      page.getDeliPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 1);
    });

    it('Pantry delete from a singular category pantry item works', () => {
      // Open pantry item dropdown
      page.getDeliPantryDropdown().click();

      // Confirm that Eggplant - Regular exists in the pantry page
      page.getDeliPantryListItems().should('have.lengthOf', 1);
      page.getDeliPantryListItems().find('.product-list-name')
        .should('contain.text', 'Eggplant - Regular');
      page.getDeliPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 1);

      // Open dropdown and delete item
      page.getFirstDeliDelete().click();
      cy.window().should('exist');
      page.deleteFirstPantryItem();

      // Confirm that Eggplant - Regular no longer exists in the pantry page
      page.navigateTo();
      page.getDeliPantryDropdown().click();
      page.getDeliPantryListItems().should('have.lengthOf', 0);
    });
  });

  describe('Add Pantry Item from pantry page works', () => {

    it('Add pantry item to product with existing items', () => {
      // Confirm that Cheese Pizza exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
      page.getDeliPantryDropdown().click();
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Cheese Pizza');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 3);

        // Look up Cheese Pizza and press add
        cy.get('[data-test=product_nameInput]').type('Cheese Pizza');
        cy.get('[data-test="addProductButton"]').click().get('[data-test="confirmAddProductToPantryButton"]').click();

        // Confirm adding Cheese Pizza
        page.getFilteredPantryDropdown().click();
        cy.get('[data-test=pantry_nameInput]').type('Cheese Pizza');
        page.getFilteredPantryListItems().should('have.lengthOf', 1);
        page.getFilteredPantryListItems().find('.product-list-name')
          .should('contain.text', 'Cheese Pizza');
        page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
          .should('contain.text', 4);
    });

    it('Add pantry item to product with no existing items', () => {
      // Confirm that Herring Fillets in wine sauce exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Herring Fillets in wine sauce');
      page.getFilteredPantryDropdown().click();
      page.getFilteredPantryListItems().should('have.lengthOf', 0);

        // Look up Herring Fillets in wine sauce and press add
        cy.get('[data-test=product_nameInput]').type('Herring Fillets in wine sauce');
        cy.get('[data-test="addProductButton"]').click().get('[data-test="confirmAddProductToPantryButton"]').click();

        // Confirm adding Herring Fillets in wine sauce
        page.getFilteredPantryDropdown().click();
        cy.wait(500);
        cy.get('[data-test=pantry_nameInput]').type('Herring Fillets in wine sauce');
        page.getFilteredPantryListItems().should('have.lengthOf', 1);
        page.getFilteredPantryListItems().find('.product-list-name')
          .should('contain.text', ' Herring Fillets In Wine Sauce ');
        page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
          .should('contain.text', 1);
    });
  });

  describe('Add Pantry item from product page works', () => {

    it('Add pantry item to product with no existing item', () => {
      // Confirm that Tomatoes - Diced exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Diced Tomatoes');
      page.getFilteredPantryDropdown().click();
      page.getFilteredPantryListItems().should('have.lengthOf', 0);

      // Go to products page
      productPage.navigateTo();

      // Get Bread - Diced Tomatoes
      cy.get('[data-test=product_nameInput]').type('Diced Tomatoes');
      productPage.getFilteredProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();

        productPage.getFilteredProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name should be correct
        cy.get('[data-test="product_nameInput"]').should('have.value', firstProductName);
      });

      // Hit Add to Pantry button
      singlePage.addToPantryButton().click();
      cy.get('[data-test="confirmAddProductToPantryButton"]').click();

      // Confirm that Diced Tomatoes was added
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Diced Tomatoes');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Diced Tomatoes');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 1);
    });

    it('Add pantry item to product with an existing item', () => {
      // Confirm that Tomatoes - Diced exists in the pantry page
      cy.get('[data-test=pantry_nameInput]').type('Diced Tomatoes');
      page.getFilteredPantryDropdown().click();
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Diced Tomatoes');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);

      // Go to products page
      productPage.navigateTo();

      // Get Bread - Diced Tomatoes
      cy.get('[data-test=product_nameInput]').type('Diced Tomatoes');
      productPage.getFilteredProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();

        productPage.getFilteredProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name should be correct
        cy.get('[data-test="product_nameInput"]').should('have.value', firstProductName);
      });

      // Hit Add to Pantry button
      singlePage.addToPantryButton().click();
      cy.get('[data-test="confirmAddProductToPantryButton"]').click();

      // Confirm that Diced Tomatoes was added
      page.getFilteredPantryDropdown().click();
      cy.get('[data-test=pantry_nameInput]').type('Diced Tomatoes');
      page.getFilteredPantryListItems().should('have.lengthOf', 1);
      page.getFilteredPantryListItems().find('.product-list-name')
        .should('contain.text', 'Diced Tomatoes');
      page.getFilteredPantryListItems().find('.pantryItem-list-quantity')
        .should('contain.text', 2);
    });
  });
});
