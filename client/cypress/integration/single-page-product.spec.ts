import { ProductListPage } from '../support/product-list.po';
import { SingleProductPage } from '../support/single-page-product.po';

const page = new ProductListPage();
const singlePage = new SingleProductPage();

describe('Single Product Page', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    // Navigate to products page
    page.navigateTo();

    // type 'r' into the name filter
    cy.get('[data-test=product_nameInput]').type('r');

    // Click the first thing that comes up
    page.getFilteredProductListItems().first().click();
    singlePage.selectEditStore('Willies');
    singlePage.selectEditCategory('produce');
  });

  it('Should be on right kind of page', () => {
    cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);
  });

  it('Tests that fields can be altered', () => {
    // Test inputs are not in the fields yet
    singlePage.getFormField('product_name').should('not.have.value', 'test name');
    singlePage.getFormField('brand').should('not.have.value', 'test brand');
    singlePage.getFormField('location').should('not.have.value', 'test location');
    singlePage.getFormField('lifespan').should('not.have.value', '69');
    singlePage.getFormField('threshold').should('not.have.value', '69');
    cy.get('[data-test="descriptionInput"]').should('not.have.value', 'test description');
    cy.get('[data-test="notesInput"]').should('not.have.value', 'test notes');

    // Put test input into the fields
    singlePage.getFormField('product_name').clear().type('test name');
    singlePage.getFormField('brand').clear().type('test brand');
    singlePage.selectEditCategory('produce');
    singlePage.selectEditStore('Willies');
    singlePage.getFormField('location').clear().type('test location');
    singlePage.getFormField('lifespan').clear().type('69');
    singlePage.getFormField('threshold').clear().type('69');
    cy.get('[data-test="descriptionInput"]').clear().type('test description');
    cy.get('[data-test="notesInput"]').clear().type('test notes');

    // Confirm changes
    cy.get('[data-test="confirmChange"]').click();

    // Assert that test inputs are indeed in the fields
    singlePage.getFormField('product_name').should('have.value', 'test name');
    singlePage.getFormField('brand').should('have.value', 'test brand');
    singlePage.getFormField('category').should('contain', 'Produce');
    singlePage.getFormField('store').should('contain', 'Willies');
    singlePage.getFormField('location').should('have.value', 'test location');
    singlePage.getFormField('lifespan').should('have.value', '69');
    singlePage.getFormField('threshold').should('have.value', '69');
    cy.get('[data-test="descriptionInput"]').should('have.value', 'test description');
    cy.get('[data-test="notesInput"]').should('have.value', 'test notes');
  });

  it('Should enable button and disable product button based on empty fields', () => {
    // Should be disabled when name and brand are empty
    singlePage.selectEditCategory('produce');
    singlePage.getFormField('product_name').clear();
    singlePage.getFormField('brand').clear();
    singlePage.editProductButton().should('be.disabled');

    // Input: name
    singlePage.getFormField('product_name').type('test');
    singlePage.editProductButton().should('be.disabled');

    // Input: brand
    singlePage.getFormField('product_name').clear();
    singlePage.getFormField('brand').type('test');
    singlePage.editProductButton().should('be.disabled');

    // Input: name and brand
    singlePage.getFormField('product_name').type('test');
    singlePage.editProductButton().should('be.enabled');
  });

  describe('Should show error messages and disabled button for invalid inputs', () => {
    it('Error messages for invalid product names', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=product_nameError]').should('not.exist');

      // Clicking the product_name field without entering anything should cause an error message
      singlePage.getFormField('product_name').clear().click().blur();
      cy.get('[data-test=product_nameError]').should('exist').and('be.visible');

      // Entering too large inputs in product_name field causes error
      singlePage.getFormField('product_name').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that incr'.repeat(2));
      cy.get('[data-test=product_nameError]').should('exist').and('be.visible');

      // Entering a valid product_name should remove the error
      singlePage.getFormField('product_name').clear().type('Heartburn Medication');
      cy.get('[data-test=product_nameError]').should('not.exist');
    });

    it('Error messages for invalid descriptions', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=descriptionError]').should('not.exist');
      singlePage.editProductButton().should('be.enabled');

      // Entering too large inputs in description field causes error
      cy.get('[data-test="descriptionInput"]').clear().click().blur();
      cy.get('[data-test="descriptionInput"]').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that inc'.repeat(3));
      singlePage.editProductButton().should('be.disabled');

      // Entering a valid description should remove the error
      cy.get('[data-test="descriptionInput"]').clear().type('Wally World');
      cy.get('[data-test=descriptionError]').should('not.exist');
      singlePage.editProductButton().should('be.enabled');
    });

    it('Error messages for invalid brands', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=brandError]').should('not.exist');

      // Clicking the brand field without entering anything should cause an error message
      singlePage.getFormField('brand').clear().click().blur();
      cy.get('[data-test=brandError]').should('exist').and('be.visible');

      // Entering too large inputs in brand field causes error
      singlePage.getFormField('brand').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(2));
      cy.get('[data-test=brandError]').should('exist').and('be.visible');

      // Entering a valid brand should remove the error
      singlePage.getFormField('brand').clear().type('Essential Oils');
      cy.get('[data-test=brandError]').should('not.exist');
    });

    it('Error messages for invalid locations', () => {
      // Before doing anything there should not be an error
      singlePage.editProductButton().should('be.enabled');

      // Entering too large inputs in location field causes error
      singlePage.getFormField('location').clear().click().blur();
      singlePage.getFormField('location').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increase'.repeat(2));
      singlePage.editProductButton().should('be.disabled');

      // Entering a valid location should remove the error
      singlePage.getFormField('location').clear().type('Aisle 42');
      singlePage.editProductButton().should('be.enabled');
    });

    it('Error messages for invalid notes', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=notesError]').should('not.exist');
      singlePage.editProductButton().should('be.enabled');

      // Entering too large inputs in notes field causes error
      cy.get('[data-test="notesInput"]').clear().click().blur();
      cy.get('[data-test="notesInput"]').type('The fitnessgram pacer test is a multi-stage aerobic capacity test that increases'.repeat(3));
      singlePage.editProductButton().should('be.disabled');

      // Entering a valid notes should remove the error
      cy.get('[data-test="notesInput"]').clear().type('Wally World');
      cy.get('[data-test=notesError]').should('not.exist');
      singlePage.editProductButton().should('be.enabled');
    });

    it('Error messages for invalid lifespans', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=lifespanError]').should('not.exist');

      // Entering too large inputs in lifespan field causes error
      singlePage.getFormField('lifespan').clear().click().blur();
      singlePage.getFormField('lifespan').type('1000001');
      cy.get('[data-test=lifespanError]').should('exist').and('be.visible');

      // Entering a valid lifespan should remove the error
      singlePage.getFormField('lifespan').clear().type('69');
      cy.get('[data-test=lifespanError]').should('not.exist');
    });

    it('Error messages for invalid thresholds', () => {
      // Before doing anything there should not be an error
      cy.get('[data-test=thresholdError]').should('not.exist');

      // Entering too large inputs in threshold field causes error
      singlePage.getFormField('threshold').clear().click().blur();
      singlePage.getFormField('threshold').type('1647263');
      cy.get('[data-test=thresholdError]').should('exist').and('be.visible');

      // Entering a valid threshold should remove the error
      singlePage.getFormField('threshold').clear().type('69');
      cy.get('[data-test=thresholdError]').should('not.exist');
    });
  });
});
