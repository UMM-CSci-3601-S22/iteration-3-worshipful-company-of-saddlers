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
      };

      page.addProduct(product);

      // New URL should end in the 24 hex character Mongo ID of the newly added product
      cy.url()
        .should('match', /\/products\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/products\/new$/);

      // The new product should have all the same attributes as we entered
      cy.get('[data-test="product_nameInput"]').should('have.value', product.product_name);
      cy.get('[data-test="brandInput"]').should('have.value', product.brand);
      cy.get('#mat-select-value-5').should('have.text', product.store);
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
  page.getFormField('threshold').type('2');
  page.getFormField('store').click().get('#mat-option-15 > .mat-option-text').click();
  page.addProductButton().should('be.disabled');

  // Input: name, brand, store
  page.getFormField('category').click().get('#mat-option-1 > .mat-option-text').click();
  page.addProductButton().should('be.enabled');

  // Input: name, store, category
  page.getFormField('threshold').clear();
  page.getFormField('store').click().get('#mat-option-15 > .mat-option-text').click();
  page.addProductButton().should('be.disabled');

  // Input: brand, category, store
  page.getFormField('product_name').clear();
  page.getFormField('threshold').type('5');
  page.addProductButton().should('be.disabled');

  // Input: All
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

    it('Error messages for invalid stores', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=storeError]').should('not.exist');

      // Clicking the store field without entering anything should cause an error message
      page.getFormField('store').click().blur();
      cy.get('body').click(300, 0);
      cy.get('[data-test=storeError]').should('exist').and('be.visible');

      // Entering a valid store should remove the error
      page.selectMatSelectValue(page.getFormField('store'), 'Willies');
      cy.get('[data-test=storeError]').should('not.exist');
    });

    it('Error messages for invalid thresholds', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=thresholdError]').should('not.exist');

      // Entering too large inputs in threshold field causes error
      page.getFormField('threshold').click().blur();
      cy.get('[data-test=thresholdError]').should('exist');
      page.getFormField('threshold').type('1647263');
      cy.get('[data-test=thresholdError]').should('exist').and('be.visible');

      // Entering a valid threshold should remove the error
      page.getFormField('threshold').clear().type('69');
      cy.get('[data-test=thresholdError]').should('not.exist');
    });
  });
});
