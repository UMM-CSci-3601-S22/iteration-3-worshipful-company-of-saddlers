import { PantryItem } from '../../src/app/pantry/pantryItem';

export class AddItemPage {
  navigateTo() {
    return cy.visit('/pantry/new');
  }

  getTitle() {
    return cy.get('.add-pantry-item-title');
  }

  addPantryItemButton() {
    return cy.get('[data-test=confirmAddItemButton]');
  }



  addPantryItem(newItem: PantryItem) {
    return this.addPantryItemButton().click();
  }
}
