import { Product } from 'src/app/products/product';
import { AddProductPage } from '../support/add-product.po';

describe('Add product', () => {
  const page = new AddProductPage();

  beforeEach(() => {
    page.navigateTo();
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
  });
});
