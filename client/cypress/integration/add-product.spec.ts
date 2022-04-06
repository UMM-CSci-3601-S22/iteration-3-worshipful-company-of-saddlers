import { Product } from 'src/app/products/product';
import { AddProductPage } from '../support/add-product.po';

describe('Add product', () => {
  const page = new AddProductPage();

  beforeEach(() => {
    page.navigateTo();
  });

  describe('Adding a new product', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const product: Product = {
        _id: null,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product_name: 'Test Product',
        description: 'description',
        brand: 'Test Brand',
        category: 'produce',
        store: 'Willies',
        location: 'Aisle 42',
        notes: 'Product Notes',
        lifespan: 30,
        threshold: 45,
        image: 'Image',
      };

      page.addProduct(product);

      // New URL should end in the 24 hex character Mongo ID of the newly added product
      cy.url()
        .should('match', /\/products\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/products\/new$/);

      // The new product should have all the same attributes as we entered
      cy.get('.product-card-name').should('have.text', product.product_name);
      cy.get('.product-card-brand').should('have.text', product.brand);
      cy.get('.product-card-category').should('have.text', product.category);
      cy.get('.product-card-store').should('have.text', product.store);
    });

    it('Should fail with no location', () => {
      const product: Product = {
        _id: null,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product_name: 'Test Product',
        description: 'description',
        brand: 'Test Brand',
        category: 'produce',
        store: 'Willies',
        location: null,
        notes: 'Product Notes',
        lifespan: 30,
        threshold: 45,
        image: 'Image',
      };

      page.addProduct(product);

      // We should get an error message
      cy.get('.mat-simple-snackbar').should('contain', `Failed to add the product`);

      // New URL should end in the 24 hex character Mongo ID of the newly added product
      cy.url()
        .should('not.match', /\/products\/[0-9a-fA-F]{24}$/)
        .should('match', /\/products\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('product_name').should('have.value', product.product_name);
      page.getFormField('brand').should('have.value', product.brand);
      page.getFormField('store').should('have.value', product.store);
      page.getFormField('category').should('contain', 'Produce');
    });

    it('Should fail with no image', () => {
      const product: Product = {
        _id: null,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product_name: 'Test Product',
        description: 'description',
        brand: 'Test Brand',
        category: 'produce',
        store: 'Willies',
        location: 'Aisle 34',
        notes: 'Product Notes',
        lifespan: 30,
        threshold: 45,
        image: null,
      };

      page.addProduct(product);

      // We should get an error message
      cy.get('.mat-simple-snackbar').should('contain', `Failed to add the product`);

      // New URL should end in the 24 hex character Mongo ID of the newly added product
      cy.url()
        .should('not.match', /\/products\/[0-9a-fA-F]{24}$/)
        .should('match', /\/products\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('product_name').should('have.value', product.product_name);
      page.getFormField('brand').should('have.value', product.brand);
      page.getFormField('store').should('have.value', product.store);
      page.getFormField('category').should('contain', 'Produce');
    });
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'Create a New Product');
  });

  it('Should enable and disable the add product button', () => {
  // ADD PRODUCT Button should be disabled until all of the required fields have inputs
  // Testing three of the four required form fields in all ways proves that the button
  // is disabled without each required form field independent the others. The button
  // will only be enabled after all four work.

  // No input
  page.addProductButton().should('be.disabled');

  // Input: name, brand, category
  page.getFormField('product_name').type('test');
  page.getFormField('brand').type('test');
  page.getFormField('store').type('Willies');
  page.addProductButton().should('be.disabled');

  // Input: name, brand, store
  page.getFormField('store').clear();
  page.getFormField('category').click().get('#mat-option-1 > .mat-option-text').click();
  page.addProductButton().should('be.disabled');

  // Input: name, store, category
  page.getFormField('brand').clear();
  page.getFormField('store').type('Willies');
  page.addProductButton().should('be.disabled');

  // Input: brand, category, store
  page.getFormField('product_name').clear();
  page.getFormField('brand').type('test');
  page.addProductButton().should('be.disabled');

  // Input: name, store
  page.getFormField('product_name').type('test');
  page.addProductButton().should('be.enabled');
  });

  describe('Should show error messages for invalid inputs', () => {
    it('Error messages for invalid product names', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=product_nameError]').should('not.exist');

      // Clicking the product_name field without entering anything should cause an error message
      page.getFormField('product_name').click().blur();
      cy.get('[data-test=product_nameError]').should('exist').and('be.visible');

      // Entering too large inputs in product_name field causes error
      page.getFormField('product_name').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(3));
      cy.get('[data-test=product_nameError]').should('exist').and('be.visible');

      // Entering a valid product_name should remove the error
      page.getFormField('product_name').clear().type('Heartburn Medication');
      cy.get('[data-test=product_nameError]').should('not.exist');
    });

    it('Error messages for invalid descriptions', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=descriptionError]').should('not.exist');

      // Entering too large inputs in description field causes error
      page.getFormField('description').click().blur();
      page.getFormField('description').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(5));
      cy.get('[data-test=descriptionError]').should('exist').and('be.visible');

      // Entering a valid description should remove the error
      page.getFormField('description').clear().type('Wally World');
      cy.get('[data-test=descriptionError]').should('not.exist');
    });

    it('Error messages for invalid brands', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=brandError]').should('not.exist');

      // Clicking the brand field without entering anything should cause an error message
      page.getFormField('brand').click().blur();
      cy.get('[data-test=brandError]').should('exist').and('be.visible');

      // Entering too large inputs in brand field causes error
      page.getFormField('brand').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(3));
      cy.get('[data-test=brandError]').should('exist').and('be.visible');

      // Entering a valid brand should remove the error
      page.getFormField('brand').clear().type('Essential Oils');
      cy.get('[data-test=brandError]').should('not.exist');
    });

    it('Error messages for invalid stores', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=storeError]').should('not.exist');

      // Clicking the store field without entering anything should cause an error message
      page.getFormField('store').click().blur();
      cy.get('[data-test=storeError]').should('exist').and('be.visible');

      // Entering too large inputs in store field causes error
      page.getFormField('store').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(3));
      cy.get('[data-test=storeError]').should('exist').and('be.visible');

      // Entering a valid store should remove the error
      page.getFormField('store').clear().type('Wally World');
      cy.get('[data-test=storeError]').should('not.exist');
    });

    it('Error messages for invalid locations', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=locationError]').should('not.exist');

      // Entering too large inputs in location field causes error
      page.getFormField('location').click().blur();
      page.getFormField('location').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(3));
      cy.get('[data-test=locationError]').should('exist').and('be.visible');

      // Entering a valid location should remove the error
      page.getFormField('location').clear().type('Aisle 42');
      cy.get('[data-test=locationError]').should('not.exist');
    });

    it('Error messages for invalid notes', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=notesError]').should('not.exist');

      // Entering too large inputs in notes field causes error
      page.getFormField('notes').click().blur();
      page.getFormField('notes').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(5));
      cy.get('[data-test=notesError]').should('exist').and('be.visible');

      // Entering a valid notes should remove the error
      page.getFormField('notes').clear().type('Wally World');
      cy.get('[data-test=notesError]').should('not.exist');
    });

    it('Error messages for invalid lifespans', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=lifespanError]').should('not.exist');

      // Entering too large inputs in lifespan field causes error
      page.getFormField('lifespan').click().blur();
      page.getFormField('lifespan').type('1000001');
      cy.get('[data-test=lifespanError]').should('exist').and('be.visible');

      // Entering a valid lifespan should remove the error
      page.getFormField('lifespan').clear().type('69');
      cy.get('[data-test=lifespanError]').should('not.exist');
    });

    it('Error messages for invalid thresholds', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=thresholdError]').should('not.exist');

      // Entering too large inputs in threshold field causes error
      page.getFormField('threshold').click().blur();
      page.getFormField('threshold').type('1647263');
      cy.get('[data-test=thresholdError]').should('exist').and('be.visible');

      // Entering a valid threshold should remove the error
      page.getFormField('threshold').clear().type('69');
      cy.get('[data-test=thresholdError]').should('not.exist');
    });
  });
});
