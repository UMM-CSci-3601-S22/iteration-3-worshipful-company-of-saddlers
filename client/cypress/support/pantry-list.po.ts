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

  getFirstFilterDelete() {
    return cy.get('.filtered-pantry-nav-list .deleteContainer').first();
  }

  getDeliPantryDropdown() {
    return cy.get('.deli-pantry-expansion-panel');
  }

  getDeliPantryListItems() {
    return cy.get('.deli-pantry-nav-list .product-list-item');
  }

  getFirstDeliDelete() {
    return cy.get('.deli-pantry-nav-list .deleteContainer').first();
  }

  deleteFirstPantryItem() {
    return cy.get('[data-test="deleteDateItemButton"]').first().click();
  }

  cancelDeletePantryItem() {
    return cy.get('[data-test="cancelDeleteItemButton"]').click();
  }
}
