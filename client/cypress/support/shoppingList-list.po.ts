import { SingleProductPage } from './single-page-product.po';

const page = new SingleProductPage();

export class ShoppingListListComponent {

  navigateToProductPage() {
    return cy.visit('/products');
  }

  navigateToShoppingList() {
    return cy.visit('/shoppingList');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-nav-list .filtered-product-list-item');
  }

  getShoppingListItems() {
    return cy.get('.shoppingList-list .shoppingList-list-item');
  }

  getFormField(fieldName: string) {
    return page.getFormField(fieldName);
  }

  getSelect(fieldName: string) {
    return page.getSelect(fieldName);
  }

  selectEditCategory(value: string) {
    // Find and click the drop down
    return page.selectEditCategory(value);
  }

  selectEditStore(value: string) {
    // Find and click the drop down
    return page.selectEditCategory(value);
  }

  editProductButton() {
    return page.editProductButton();
  }
}

