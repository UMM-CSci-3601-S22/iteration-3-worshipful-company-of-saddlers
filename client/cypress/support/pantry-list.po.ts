export class PantryListPage {
  navigateTo() {
    return cy.visit('/');
  }

  getFilteredPantryDropdown() {
    return cy.get('.pantry-items-expansion-panel');
  }

  getFilteredPantryListItems() {
    return cy.get('.filtered-pantry-nav-list .product-list-item');
  }
}
