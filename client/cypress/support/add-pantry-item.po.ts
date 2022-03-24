import { PantryService } from 'src/app/pantry/pantry.service';

export class AddItemPage {
  navigateTo() {
    return cy.visit('/pantry/new');
  }
}
