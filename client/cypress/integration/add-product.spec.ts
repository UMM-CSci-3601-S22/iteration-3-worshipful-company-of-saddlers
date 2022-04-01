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
});
