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
    // Filter for product Shrimp - Black Tiger 13/15
    cy.get('[data-test=product_nameInput]').type('Shrimp - Black Tiger 13/15');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Shrimp - Black Tiger 13/15')
      .should('not.contain.text', 'Shrimp - 16/20, Iqf, Shell On')
      .should('not.contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something partial in the product name filter and check that it returned correct products', () => {
    // Filter for product Shrimp
    cy.get('[data-test=product_nameInput]').type('Shrimp');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product name we are filtering by
    page.getFilteredProductListItems().find('.product-list-name')
    .should('contain.text', 'Shrimp - Black Tiger 13/15')
    .should('contain.text', 'Shrimp - 16/20, Iqf, Shell On')
    .should('not.contain.text', 'Cake Circle, Foil, Scallop');
  });

  it('Should type something in the brand filter and check that it returned correct products', () => {
    // Filter for brand Kozey, Rowe and Krajcik
    cy.get('[data-test=productBrandInput]').type('Kozey, Rowe and Krajcik');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
      .should('contain.text', 'Kozey, Rowe and Krajcik')
      .should('not.contain.text', 'Rowe and Sons')
      .should('not.contain.text', 'Treutel-Howell');
  });

  it('Should type something partial in the brand filter and check that it returned correct products', () => {
    // Filter for brand Rowe
    cy.get('[data-test=productBrandInput]').type('Rowe');

    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product brand we are filtering by
    page.getFilteredProductListItems().find('.product-list-brand')
    .should('contain.text', 'Kozey, Rowe and Krajcik')
    .should('contain.text', 'Rowe and Sons')
    .should('not.contain.text', 'Treutel-Howell');
  });

  it('Should select a store filter and check that it returned correct products', () => {
    // Filter for store Willies
    page.selectStore('Willies');

    // It takes too much time for the page to load, which causes the test
    // to fail since it times out after 4000ms. Having cypress wait for 4
    // seconds catches the system up to confirm the assertions without timing out
    cy.wait(1000);

    page.getFilteredProductListItems().should('exist');
    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product store name we are filtering by
    page.getFilteredProductListItems().find('.product-list-store')
      .should('contain.text', 'Willies')
      .should('not.contain.text', 'Pomme de Terre');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Ice Cream - Chocolate')
      .should('contain.text', 'Smoked Paprika')
      .should('not.contain.text', 'Muffin Hinge 117n')
      .should('not.contain.text', 'Sprouts - Bean');
  });

  it('Should select a category filter and check that it returned correct products', () => {
    // Filter for category Produce
    page.selectCategory('baked goods');

    page.getFilteredProductListItems().should('exist');
    page.getFilteredProductListItems().should('have.lengthOf.above', 0);
    // All returned filtered products should have the product category we are filtering by
    page.getFilteredProductListItems().find('.product-list-category')
      .should('contain.text', 'baked goods')
      .should('not.contain.text', 'baking supplies')
      .should('not.contain.text', 'beverage')
      .should('not.contain.text', 'cleaning supplies')
      .should('not.contain.text', 'dairy')
      .should('not.contain.text', 'deli')
      .should('not.contain.text', 'frozen foods')
      .should('not.contain.text', 'herbs and spices')
      .should('not.contain.text', 'meat')
      .should('not.contain.text', 'miscellaneous')
      .should('not.contain.text', 'paper products')
      .should('not.contain.text', 'pet supplies')
      .should('not.contain.text', 'produce')
      .should('not.contain.text', 'staple')
      .should('not.contain.text', 'toiletries');
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Fireball Whisky')
      .should('contain.text', 'Flour - Fast / Rapid')
      .should('not.contain.text', 'Muffin Puck Ww Carrot')
      .should('not.contain.text', 'Bread - White, Unsliced');
  });

  it('Should click filtered product and go to the right URL', () => {
    // Get Bread - White, Unsliced
    cy.get('[data-test=product_nameInput]').type('Bread - White, Unsliced');
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

  it('Product delete cancel from filtering works', () => {
    // Confirm that Cocktail Napkin Blue exists in the products page
    cy.get('[data-test=product_nameInput]').type('Cocktail Napkin Blue');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cocktail Napkin Blue');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

    // Confirm that Cocktail Napkin Blue still exists in the products page
    page.getFilteredProductListItems().should('have.lengthOf', 1);
  });

  it('Product delete from filtering works', () => {
    // Confirm that Cocktail Napkin Blue exists in the products page
    cy.get('[data-test=product_nameInput]').type('Cocktail Napkin Blue');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Cocktail Napkin Blue');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('.mat-warn > .mat-button-wrapper').click();

    // Confirm that Cocktail Napkin Blue no longer exists in the products page
    cy.get('[data-test=product_nameInput]').type('Cocktail Napkin Blue');
    page.getFilteredProductListItems().should('have.lengthOf', 0);
  });

  describe('Baked goods product list works', () => {
    it('The baked goods products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the baked goods products should be hidden
      page.getBakedGoodsProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getBakedGoodsProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the baked goods products should not be hidden
      page.getBakedGoodsProductDropdown().click();
      page.getBakedGoodsProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the baked goods product should not be hidden
      page.getBakedGoodsProductDropdown().click();
      page.getBakedGoodsProductListItems().should('not.be.visible');
    });

    it('Should click baked goods product and go to the right URL', () => {
      // Get baked goods product list dropdown
      page.getBakedGoodsProductDropdown().click();
      page.getBakedGoodsProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getBakedGoodsProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'baked goods');
      });
    });

    it('Product delete cancel from the baked goods dropdown works', () => {
      // Confirm that Fireball Whisky exists in the products page
      cy.get('[data-test=product_nameInput]').type('Fireball Whisky');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Fireball Whisky');

      // Open dropdown and delete item
      page.getBakedGoodsProductDropdown().click();
      page.getFirstBakedGoodsDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Fireball Whisky still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the baked goods dropdown works', () => {
      // Confirm that Fireball Whisky exists in the products page
      cy.get('[data-test=product_nameInput]').type('Fireball Whisky');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Fireball Whisky');

      // Open dropdown and delete item
      page.getBakedGoodsProductDropdown().click();
      page.getFirstBakedGoodsDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Fireball Whisky no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Baking supplies product list works', () => {
    it('The baking supplies products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the baking supplies products should be hidden
      page.getBakingSuppliesProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getBakingSuppliesProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the baking supplies products should not be hidden
      page.getBakingSuppliesProductDropdown().click();
      page.getBakingSuppliesProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the baking supplies product should not be hidden
      page.getBakingSuppliesProductDropdown().click();
      page.getBakingSuppliesProductListItems().should('not.be.visible');
    });

    it('Should click baking supplies product and go to the right URL', () => {
      // Get baking supplies product list dropdown
      page.getBakingSuppliesProductDropdown().click();
      page.getBakingSuppliesProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getBakingSuppliesProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'baking supplies');
      });
    });

    it('Product delete cancel from the baking supplies dropdown works', () => {
      // Confirm that Beer - Paulaner Hefeweisse exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beer - Paulaner Hefeweisse');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beer - Paulaner Hefeweisse');

      // Open dropdown and delete item
      page.getBakingSuppliesProductDropdown().click();
      page.getFirstBakingSuppliesDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beer - Paulaner Hefeweisse still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the baking supplies dropdown works', () => {
      // Confirm that Beer - Paulaner Hefeweisse exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beer - Paulaner Hefeweisse');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beer - Paulaner Hefeweisse');

      // Open dropdown and delete item
      page.getBakingSuppliesProductDropdown().click();
      page.getFirstBakingSuppliesDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beer - Paulaner Hefeweisse no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Beverage product list works', () => {
    it('The beverage products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the beverage products should be hidden
      page.getBeverageProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getBeverageProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the beverage products should not be hidden
      page.getBeverageProductDropdown().click();
      page.getBeverageProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the beverage product should not be hidden
      page.getBeverageProductDropdown().click();
      page.getBeverageProductListItems().should('not.be.visible');
    });

    it('Should click beverages product and go to the right URL', () => {
      // Get beverages product list dropdown
      page.getBeverageProductDropdown().click();
      page.getBeverageProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getBeverageProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'beverages');
      });
    });

    it('Product delete cancel from the beverage dropdown works', () => {
      // Confirm that Nutmeg - Ground exists in the products page
      cy.get('[data-test=product_nameInput]').type('Nutmeg - Ground');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Nutmeg - Ground');

      // Open dropdown and delete item
      page.getBeverageProductDropdown().click();
      page.getFirstBeverageProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Nutmeg - Ground still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the beverage dropdown works', () => {
      // Confirm that Nutmeg - Ground exists in the products page
      cy.get('[data-test=product_nameInput]').type('Nutmeg - Ground');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Nutmeg - Ground');

      // Open dropdown and delete item
      page.getBeverageProductDropdown().click();
      page.getFirstBeverageProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Nutmeg - Ground no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Cleaning products product list works', () => {
    it('The cleaning products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the cleaning products should be hidden
      page.getCleaningProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getCleaningProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the cleaning products should not be hidden
      page.getCleaningProductDropdown().click();
      page.getCleaningProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the cleaning products product should not be hidden
      page.getCleaningProductDropdown().click();
      page.getCleaningProductListItems().should('not.be.visible');
    });

    it('Should click cleaning products product and go to the right URL', () => {
      // Get cleaning products product list dropdown
      page.getCleaningProductDropdown().click();
      page.getCleaningProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getCleaningProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'cleaning products');
      });
    });

    it('Product delete cancel from the cleaning products dropdown works', () => {
      // Confirm that Beer - Molson Excel exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beer - Molson Excel');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beer - Molson Excel');

      // Open dropdown and delete item
      page.getCleaningProductDropdown().click();
      page.getFirstCleaningProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beer - Molson Excel still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the cleaning products dropdown works', () => {
      // Confirm that Beer - Molson Excel exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beer - Molson Excel');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beer - Molson Excel');

      // Open dropdown and delete item
      page.getCleaningProductDropdown().click();
      page.getFirstCleaningProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beer - Molson Excel no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click dairy product and go to the right URL', () => {
      // Get dairy product list dropdown
      page.getDairyProductDropdown().click();
      page.getDairyProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getDairyProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'dairy');
      });
    });

    it('Product delete cancel from the dairy dropdown works', () => {
      // Confirm that Bread - White, Unsliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bread - White, Unsliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bread - White, Unsliced');

      // Open dropdown and delete item
      page.getDairyProductDropdown().click();
      page.getFirstDairyProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Bread - White, Unsliced still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the dairy dropdown works', () => {
      // Confirm that Bread - White, Unsliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bread - White, Unsliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bread - White, Unsliced');

      // Open dropdown and delete item
      page.getDairyProductDropdown().click();
      page.getFirstDairyProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Bread - White, Unsliced no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Deli list works', () => {
    it('The deli products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the deli products should be hidden
      page.getDeliProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getDeliProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the deli products should not be hidden
      page.getDeliProductDropdown().click();
      page.getDeliProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the deli product should not be hidden
      page.getDeliProductDropdown().click();
      page.getDeliProductListItems().should('not.be.visible');
    });

    it('Should click deli and go to the right URL', () => {
      // Get deli product list dropdown
      page.getDeliProductDropdown().click();
      page.getDeliProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getDeliProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'deli');
      });
    });

    it('Product delete cancel from the deli dropdown works', () => {
      // Confirm that Beans - Navy, Dry exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beans - Navy, Dry');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beans - Navy, Dry');

      // Open dropdown and delete item
      page.getDeliProductDropdown().click();
      page.getFirstDeliProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beans - Navy, Dry still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the deli dropdown works', () => {
      // Confirm that Beans - Navy, Dry exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beans - Navy, Dry');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beans - Navy, Dry');

      // Open dropdown and delete item
      page.getDeliProductDropdown().click();
      page.getFirstDeliProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beans - Navy, Dry no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click frozen product and go to the right URL', () => {
      // Get frozen food product list dropdown
      page.getFrozenProductDropdown().click();
      page.getFrozenProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getFrozenProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'frozen foods');
      });
    });

    it('Product delete cancel from the frozen foods dropdown works', () => {
      // Confirm that Crab - Back Fin Meat, Canned exists in the products page
      cy.get('[data-test=product_nameInput]').type('Crab - Back Fin Meat, Canned');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Crab - Back Fin Meat, Canned');

      // Open dropdown and delete item
      page.getFrozenProductDropdown().click();
      page.getFirstFrozenProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Crab - Back Fin Meat, Canned still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the frozen foods dropdown works', () => {
      // Confirm that Crab - Back Fin Meat, Canned exists in the products page
      cy.get('[data-test=product_nameInput]').type('Crab - Back Fin Meat, Canned');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Crab - Back Fin Meat, Canned');

      // Open dropdown and delete item
      page.getFrozenProductDropdown().click();
      page.getFirstFrozenProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Crab - Back Fin Meat, Canned no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Herbs and spices product list works', () => {
    it('The herbs and spices products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the herbs and spices products should be hidden
      page.getHerbProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getHerbProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the herbs and spices products should not be hidden
      page.getHerbProductDropdown().click();
      page.getHerbProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the herbs and spices product should not be hidden
      page.getHerbProductDropdown().click();
      page.getHerbProductListItems().should('not.be.visible');
    });

    it('Should click herbs and spices product and go to the right URL', () => {
      // Get herbs and spices product list dropdown
      page.getHerbProductDropdown().click();
      page.getHerbProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getHerbProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'herbs and spices');
      });
    });

    it('Product delete cancel from the herbs and spices dropdown works', () => {
      // Confirm that Bread - White, Sliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bread - White, Sliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bread - White, Sliced');

      // Open dropdown and delete item
      page.getHerbProductDropdown().click();
      page.getFirstHerbProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Bread - White, Sliced still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the herbs and spices dropdown works', () => {
      // Confirm that Bread - White, Sliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bread - White, Sliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bread - White, Sliced');

      // Open dropdown and delete item
      page.getHerbProductDropdown().click();
      page.getFirstHerbProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Bread - White, Sliced no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click meat product and go to the right URL', () => {
      // Get meat product list dropdown
      page.getMeatProductDropdown().click();
      page.getMeatProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getMeatProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'meat');
      });
    });

    it('Product delete cancel from the meat dropdown works', () => {
      // Confirm that Chickhen - Chicken Phyllo exists in the products page
      cy.get('[data-test=product_nameInput]').type('Chickhen - Chicken Phyllo');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Chickhen - Chicken Phyllo');

      // Open dropdown and delete item
      page.getMeatProductDropdown().click();
      page.getFirstMeatProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Chickhen - Chicken Phyllo still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the meat dropdown works', () => {
      // Confirm that Chickhen - Chicken Phyllo exists in the products page
      cy.get('[data-test=product_nameInput]').type('Chickhen - Chicken Phyllo');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Chickhen - Chicken Phyllo');

      // Open dropdown and delete item
      page.getMeatProductDropdown().click();
      page.getFirstMeatProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Chickhen - Chicken Phyllo no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click miscellaneous product and go to the right URL', () => {
      // Get miscellaneous product list dropdown
      page.getMiscellaneousProductDropdown().click();
      page.getMiscellaneousProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getMiscellaneousProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'miscellaneous');
      });
    });

    it('Product delete cancel from the miscellaneous dropdown works', () => {
      // Confirm that Pork Loin Bine - In Frenched exists in the products page
      cy.get('[data-test=product_nameInput]').type('Pork Loin Bine - In Frenched');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Pork Loin Bine - In Frenched');

      // Open dropdown and delete item
      page.getMiscellaneousProductDropdown().click();
      page.getFirstMiscellaneousProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Pork Loin Bine - In Frenched still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the miscellaneous dropdown works', () => {
      // Confirm that Pork Loin Bine - In Frenched exists in the products page
      cy.get('[data-test=product_nameInput]').type('Pork Loin Bine - In Frenched');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Pork Loin Bine - In Frenched');

      // Open dropdown and delete item
      page.getMiscellaneousProductDropdown().click();
      page.getFirstMiscellaneousProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Pork Loin Bine - In Frenched no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Paper Supplies product list works', () => {
    it('The paper products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the paper products should be hidden
      page.getPaperProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getPaperProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the paper products should not be hidden
      page.getPaperProductDropdown().click();
      page.getPaperProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the paper product should not be hidden
      page.getPaperProductDropdown().click();
      page.getPaperProductListItems().should('not.be.visible');
    });

    it('Should click paper product and go to the right URL', () => {
      // Get paper product list dropdown
      page.getPaperProductDropdown().click();
      page.getPaperProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getPaperProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'paper products');
      });
    });

    it('Product delete cancel from the paper dropdown works', () => {
      // Confirm that Grapes - Red exists in the products page
      cy.get('[data-test=product_nameInput]').type('Grapes - Red');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Grapes - Red');

      // Open dropdown and delete item
      page.getPaperProductDropdown().click();
      page.getFirstPaperProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Grapes - Red still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the paper dropdown works', () => {
      // Confirm that Grapes - Red exists in the products page
      cy.get('[data-test=product_nameInput]').type('Grapes - Red');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Grapes - Red');

      // Open dropdown and delete item
      page.getPaperProductDropdown().click();
      page.getFirstPaperProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Grapes - Red no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Pet Supplies product list works', () => {
    it('The pet products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the pet products should be hidden
      page.getPetProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getPetProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the pet products should not be hidden
      page.getPetProductDropdown().click();
      page.getPetProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the pet product should not be hidden
      page.getPetProductDropdown().click();
      page.getPetProductListItems().should('not.be.visible');
    });

    it('Should click pet product and go to the right URL', () => {
      // Get pet product list dropdown
      page.getPetProductDropdown().click();
      page.getPetProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getPetProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'pet supplies');
      });
    });

    it('Product delete cancel from the pet dropdown works', () => {
      // Confirm that Almonds Ground Blanched exists in the products page
      cy.get('[data-test=product_nameInput]').type('Almonds Ground Blanched');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Almonds Ground Blanched');

      // Open dropdown and delete item
      page.getPetProductDropdown().click();
      page.getFirstPetProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Almonds Ground Blanched still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the pet dropdown works', () => {
      // Confirm that Almonds Ground Blanched exists in the products page
      cy.get('[data-test=product_nameInput]').type('Almonds Ground Blanched');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Almonds Ground Blanched');

      // Open dropdown and delete item
      page.getPetProductDropdown().click();
      page.getFirstPetProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Grapes - Red no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click produce product and go to the right URL', () => {
      // Get produce product list dropdown
      page.getProduceProductDropdown().click();
      page.getProduceProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getProduceProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'produce');
      });
    });

    it('Product delete cancel from the produce dropdown works', () => {
      // Confirm that Onions - Dried, Chopped exists in the products page
      cy.get('[data-test=product_nameInput]').type('Onions - Dried, Chopped');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Onions - Dried, Chopped');

      // Open dropdown and delete item
      page.getProduceProductDropdown().click();
      page.getFirstProduceProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Onions - Dried, Chopped still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the produce dropdown works', () => {
      // Confirm that Onions - Dried, Chopped exists in the products page
      cy.get('[data-test=product_nameInput]').type('Onions - Dried, Chopped');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Onions - Dried, Chopped');

      // Open dropdown and delete item
      page.getProduceProductDropdown().click();
      page.getFirstProduceProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Onions - Dried, Chopped no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Staple product list works', () => {
    it('The staple products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the staple products should be hidden
      page.getStapleProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getStapleProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the staple products should not be hidden
      page.getStapleProductDropdown().click();
      page.getStapleProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the staple product should not be hidden
      page.getStapleProductDropdown().click();
      page.getStapleProductListItems().should('not.be.visible');
    });

    it('Should click staple product and go to the right URL', () => {
      // Get staple product list dropdown
      page.getStapleProductDropdown().click();
      page.getStapleProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getStapleProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'staples');
      });
    });

    it('Product delete cancel from the staple dropdown works', () => {
      // Confirm that Coriander - Ground exists in the products page
      cy.get('[data-test=product_nameInput]').type('Coriander - Ground');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Coriander - Ground');

      // Open dropdown and delete item
      page.getStapleProductDropdown().click();
      page.getFirstStapleProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Coriander - Ground still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the staple dropdown works', () => {
      // Confirm that Coriander - Ground exists in the products page
      cy.get('[data-test=product_nameInput]').type('Coriander - Ground');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Coriander - Ground');

      // Open dropdown and delete item
      page.getStapleProductDropdown().click();
      page.getFirstStapleProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Coriander - Ground no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  describe('Toiletries product list works', () => {
    it('The toiletries products should appear and disappear when the panel is clicked', () => {
      // Before clicking on the button, the toiletries products should be hidden
      page.getToiletriesProductListItems()
        .should('be.hidden')
        .and('not.be.visible');
      page.getToiletriesProductDropdown()
        .should('exist');
      // After clicking the dropdown panel, the toiletries products should not be hidden
      page.getToiletriesProductDropdown().click();
      page.getToiletriesProductListItems().should('be.visible');
      // After clicking the dropdown panel again, the toiletries product should not be hidden
      page.getToiletriesProductDropdown().click();
      page.getToiletriesProductListItems().should('not.be.visible');
    });

    it('Should click toiletries product and go to the right URL', () => {
      // Get toiletries product list dropdown
      page.getToiletriesProductDropdown().click();
      page.getToiletriesProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getToiletriesProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'toiletries');
      });
    });

    it('Product delete cancel from the toiletries dropdown works', () => {
      // Confirm that Appetizer - Mushroom Tart exists in the products page
      cy.get('[data-test=product_nameInput]').type('Appetizer - Mushroom Tart');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Appetizer - Mushroom Tart');

      // Open dropdown and delete item
      page.getToiletriesProductDropdown().click();
      page.getFirstToiletriesProductDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Appetizer - Mushroom Tart still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the toiletries dropdown works', () => {
      // Confirm that Appetizer - Mushroom Tart exists in the products page
      cy.get('[data-test=product_nameInput]').type('Appetizer - Mushroom Tart');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Appetizer - Mushroom Tart');

      // Open dropdown and delete item
      page.getToiletriesProductDropdown().click();
      page.getFirstToiletriesProductDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Appetizer - Mushroom Tart no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  it('Should click add product and go to the right URL', () => {
    page.addProductButton().click();

    cy.url().should(url => expect(url.endsWith('/products/new')).to.be.true);

    cy.get('.add-product-title').should('have.text', 'Create a New Product');
  });
});
