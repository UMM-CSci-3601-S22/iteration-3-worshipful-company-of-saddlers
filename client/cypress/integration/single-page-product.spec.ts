import { ProductListPage } from '../support/product-list.po';
import { SingleProductPage } from '../support/single-page-product.po';

const page = new ProductListPage();
const singlePage = new SingleProductPage();

describe('Product list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();

    cy.get('[data-test=product_nameInput]').type('r');

    page.getFilteredProductListItems().first().click();
  });

  it('Should be on right kind of page', () => {
    cy.url().should('match', /products\/[0-9a-fA-F]{24}$/);
  });

  it('Tests that fields can be altered', () => {
    // Test inputs are not in the fields yet
    singlePage.getFormField('brand').should('not.have.value', 'test brand');
    singlePage.getFormField('location').should('not.have.value', 'test location');
    singlePage.getFormField('lifespan').should('not.have.value', '69');
    singlePage.getFormField('threshold').should('not.have.value', '69');
    cy.get('[data-test="descriptionInput"]').should('not.have.value', 'test description');
    cy.get('[data-test="notesInput"]').should('not.have.value', 'test notes');

    // Put test input into the fields
    singlePage.getFormField('brand').clear().type('test brand');
    singlePage.selectEditCategory('Produce');
    singlePage.selectEditStore('Willies');
    singlePage.getFormField('location').clear().type('test location');
    singlePage.getFormField('lifespan').clear().type('69');
    singlePage.getFormField('threshold').clear().type('69');
    cy.get('[data-test="descriptionInput"]').clear().type('test description');
    cy.get('[data-test="notesInput"]').clear().type('test notes');

    // Confirm changes
    cy.get('[data-test="confirmChange"]').click();

    // Assert that test inputs are indeed in the fields
    singlePage.getFormField('brand').should('have.value', 'test brand');
    singlePage.getFormField('category').should('contain', 'Produce');
    singlePage.getFormField('store').should('contain', 'Willies');
    singlePage.getFormField('location').should('have.value', 'test location');
    singlePage.getFormField('lifespan').should('have.value', '69');
    singlePage.getFormField('threshold').should('have.value', '69');
    cy.get('[data-test="descriptionInput"]').should('have.value', 'test description');
    cy.get('[data-test="notesInput"]').should('have.value', 'test notes');
  });
});
