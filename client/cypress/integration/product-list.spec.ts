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
    cy.wait(1000);

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

  it('Product delete cancel from filtering works', () => {
    // Confirm that Hagen Daza - Dk Choocolate exists in the products page
    cy.get('[data-test=product_nameInput]').type('Hagen Daza - Dk Choocolate');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Hagen Daza - Dk Choocolate');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

    // Confirm that Hagen Daza - Dk Choocolate still exists in the products page
    page.getFilteredProductListItems().should('have.lengthOf', 1);
  });

  it('Product delete from filtering works', () => {
    // Confirm that Hagen Daza - Dk Choocolate exists in the products page
    cy.get('[data-test=product_nameInput]').type('Hagen Daza - Dk Choocolate');
    page.getFilteredProductListItems().should('have.lengthOf', 1);
    page.getFilteredProductListItems().find('.product-list-name')
      .should('contain.text', 'Hagen Daza - Dk Choocolate');

    // Open dropdown and delete item
    page.getFirstFilterDelete().click();
    cy.window().should('exist');
    cy.get('.mat-warn > .mat-button-wrapper').click();

    // Confirm that Hagen Daza - Dk Choocolate no longer exists in the products page
    cy.get('[data-test=product_nameInput]').type('Hagen Daza - Dk Choocolate');
    page.getFilteredProductListItems().should('have.lengthOf', 0);
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
      // Confirm that Beef - Tenderlion, Center Cut exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Tenderlion, Center Cut');

      // Open dropdown and delete item
      page.getProduceProductDropdown().click();
      page.getFirstProduceDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beef - Tenderlion, Center Cut still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the produce dropdown works', () => {
      // Confirm that Beef - Tenderlion, Center Cut exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Tenderlion, Center Cut');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Tenderlion, Center Cut');

      // Open dropdown and delete item
      page.getProduceProductDropdown().click();
      page.getFirstProduceDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beef - Tenderlion, Center Cut no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click bakery product and go to the right URL', () => {
      // Get bakery product list dropdown
      page.getBakeryProductDropdown().click();
      page.getBakeryProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getBakeryProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'bakery');

      });
    });

    it('Product delete cancel from the Bakery dropdown works', () => {
      // Confirm that Apple - Delicious, Red exists in the products page
      cy.get('[data-test=product_nameInput]').type('Apple - Delicious, Red');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Apple - Delicious, Red');

      // Open dropdown and delete item
      page.getBakeryProductDropdown().click();
      page.getFirstBakeryDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Apple - Delicious, Red still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the bakery dropdown works', () => {
      // Confirm that Apple - Delicious, Red exists in the products page
      cy.get('[data-test=product_nameInput]').type('Apple - Delicious, Red');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Apple - Delicious, Red');

      // Open dropdown and delete item
      page.getBakeryProductDropdown().click();
      page.getFirstBakeryDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Apple - Delicious, Red no longer exists in the products page
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
      // Confirm that Appetizer - Assorted Box exists in the products page
      cy.get('[data-test=product_nameInput]').type('Appetizer - Assorted Box');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Appetizer - Assorted Box');

      // Open dropdown and delete item
      page.getMeatProductDropdown().click();
      page.getFirstMeatDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Appetizer - Assorted Box still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the meat dropdown works', () => {
      // Confirm that Appetizer - Assorted Box exists in the products page
      cy.get('[data-test=product_nameInput]').type('Appetizer - Assorted Box');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Appetizer - Assorted Box');

      // Open dropdown and delete item
      page.getMeatProductDropdown().click();
      page.getFirstMeatDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Appetizer - Assorted Box no longer exists in the products page
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
      // Confirm that Cinnamon Rolls exists in the products page
      cy.get('[data-test=product_nameInput]').type('Cinnamon Rolls');
      page.getFilteredProductListItems().should('have.lengthOf', 3);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Cinnamon Rolls');

      // Open dropdown and delete item
      page.getDairyProductDropdown().click();
      page.getFirstDairyDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Cinnamon Rolls still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 3);
    });

    it('Product delete from the dairy dropdown works', () => {
      // Confirm that Cinnamon Rolls exists in the products page
      cy.get('[data-test=product_nameInput]').type('Cinnamon Rolls');
      page.getFilteredProductListItems().should('have.lengthOf', 3);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Cinnamon Rolls');

      // Open dropdown and delete item
      page.getDairyProductDropdown().click();
      page.getFirstDairyDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Cinnamon Rolls no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 2);
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

    it('Should click drinks product and go to the right URL', () => {
      // Get drinks product list dropdown
      page.getDrinkProductDropdown().click();
      page.getDrinkProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getDrinkProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'drinks');

      });
    });

    it('Product delete cancel from the drinks dropdown works', () => {
      // Confirm that Apples - Sliced / Wedge exists in the products page
      cy.get('[data-test=product_nameInput]').type('Apples - Sliced / Wedge');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Apples - Sliced / Wedge');

      // Open dropdown and delete item
      page.getDrinkProductDropdown().click();
      page.getFirstDrinkDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Apples - Sliced / Wedge still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the drinks dropdown works', () => {
      // Confirm that Apples - Sliced / Wedge exists in the products page
      cy.get('[data-test=product_nameInput]').type('Apples - Sliced / Wedge');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Apples - Sliced / Wedge');

      // Open dropdown and delete item
      page.getDrinkProductDropdown().click();
      page.getFirstDrinkDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Apples - Sliced / Wedge no longer exists in the products page
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
      // Confirm that Beef - Bones, Cut - Up exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Bones, Cut - Up');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Bones, Cut - Up');

      // Open dropdown and delete item
      page.getFrozenProductDropdown().click();
      page.getFirstFrozenDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beef - Bones, Cut - Up still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the frozen foods dropdown works', () => {
      // Confirm that Beef - Bones, Cut - Up exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Bones, Cut - Up');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Bones, Cut - Up');

      // Open dropdown and delete item
      page.getFrozenProductDropdown().click();
      page.getFirstFrozenDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beef - Bones, Cut - Up no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click canned goods product and go to the right URL', () => {
      // Get canned goods product list dropdown
      page.getCannedProductDropdown().click();
      page.getCannedProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getCannedProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'canned goods');

      });
    });

    it('Product delete cancel from the canned goods dropdown works', () => {
      // Confirm that Bag Stand exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bag Stand');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bag Stand');

      // Open dropdown and delete item
      page.getCannedProductDropdown().click();
      page.getFirstCannedDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Bag Stand still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the canned goods dropdown works', () => {
      // Confirm that Bag Stand exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bag Stand');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bag Stand');

      // Open dropdown and delete item
      page.getCannedProductDropdown().click();
      page.getFirstCannedDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Bag Stand no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click general product and go to the right URL', () => {
      // Get general product list dropdown
      page.getGeneralProductDropdown().click();
      page.getGeneralProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getGeneralProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'general grocery');

      });
    });

    it('Product delete cancel from the general dropdown works', () => {
      // Confirm that Bagel - Sesame Seed Presliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bagel - Sesame Seed Presliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bagel - Sesame Seed Presliced');

      // Open dropdown and delete item
      page.getGeneralProductDropdown().click();
      page.getFirstGeneralDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Bagel - Sesame Seed Presliced still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the general dropdown works', () => {
      // Confirm that Bagel - Sesame Seed Presliced exists in the products page
      cy.get('[data-test=product_nameInput]').type('Bagel - Sesame Seed Presliced');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Bagel - Sesame Seed Presliced');

      // Open dropdown and delete item
      page.getGeneralProductDropdown().click();
      page.getFirstGeneralDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Bagel - Sesame Seed Presliced no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
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

    it('Should click seasonal product and go to the right URL', () => {
      // Get seasonal product list dropdown
      page.getSeasonalProductDropdown().click();
      page.getSeasonalProductListItems().first().then((list) => {
        const firstProductName = list.find('.product-list-name').text().trim();
        const firstProductCategory = list.find('.product-list-category').text().trim();

        page.getSeasonalProductListItems().first().click();

        // The URL should be '/products/' followed by a mongo ID
        cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);

        // On this profile page we were sent to, the name and category should be correct
        cy.get('.product-card-name').should('have.text', firstProductName);
        cy.get('.product-card-category').first().should('have.text', 'seasonal');

      });
    });

    it('Product delete cancel from the seasonal dropdown works', () => {
      // Confirm that Beef - Ground Lean Fresh exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Ground Lean Fresh');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Ground Lean Fresh');

      // Open dropdown and delete item
      page.getSeasonalProductDropdown().click();
      page.getFirstSeasonalDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Beef - Ground Lean Fresh still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the seasonal dropdown works', () => {
      // Confirm that Beef - Ground Lean Fresh exists in the products page
      cy.get('[data-test=product_nameInput]').type('Beef - Ground Lean Fresh');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Beef - Ground Lean Fresh');

      // Open dropdown and delete item
      page.getSeasonalProductDropdown().click();
      page.getFirstSeasonalDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Beef - Ground Lean Fresh no longer exists in the products page
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
      // Confirm that Arctic Char - Fresh, Whole exists in the products page
      cy.get('[data-test=product_nameInput]').type('Arctic Char - Fresh, Whole');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Arctic Char - Fresh, Whole');

      // Open dropdown and delete item
      page.getMiscellaneousProductDropdown().click();
      page.getFirstMiscellaneousDelete().click();
      cy.window().should('exist');
      cy.get('[cdkfocusinitial=""] > .mat-button-wrapper').click();

      // Confirm that Arctic Char - Fresh, Whole still exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 1);
    });

    it('Product delete from the miscellaneous dropdown works', () => {
      // Confirm that Arctic Char - Fresh, Whole exists in the products page
      cy.get('[data-test=product_nameInput]').type('Arctic Char - Fresh, Whole');
      page.getFilteredProductListItems().should('have.lengthOf', 1);
      page.getFilteredProductListItems().find('.product-list-name')
        .should('contain.text', 'Arctic Char - Fresh, Whole');

      // Open dropdown and delete item
      page.getMiscellaneousProductDropdown().click();
      page.getFirstMiscellaneousDelete().click();
      cy.window().should('exist');
      cy.get('.mat-warn > .mat-button-wrapper').click();

      // Confirm that Arctic Char - Fresh, Whole no longer exists in the products page
      page.getFilteredProductListItems().should('have.lengthOf', 0);
    });
  });

  it('Should click add product and go to the right URL', () => {
    page.addProductButton().click();

    cy.url().should(url => expect(url.endsWith('/products/new')).to.be.true);

    cy.get('.add-product-title').should('have.text', 'Create a New Product');
  });
});
