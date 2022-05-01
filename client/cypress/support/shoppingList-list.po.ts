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

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  getSelect(fieldName: string) {
    return cy.get(`mat-select [formcontrolname=${fieldName}]`);
  }

  selectEditCategory(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=categoryDropDown]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  selectEditStore(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=storeDropDown]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  editProductButton() {
    return cy.get('[data-test=confirmChange]');
  }
}

