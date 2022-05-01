import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ShoppingList } from '../app/shoppingList/shoppingList';
import { ShoppingListService } from '../app/shoppingList/shopping-list-list/shoppingList.service';

@Injectable()
export class MockShoppingListService extends ShoppingListService {
  testShoppingList: Array<ShoppingList> = [
    {
      _id: 'apple_id',
      name:'Apple',
      quantity: 3,
      productID: '44444444',
    },
    {
      _id: 'orange_id',
      name:'Orange',
      quantity: 4,
      productID: '444444445',
    },
    {
      _id: 'rootBeer_id',
      name:'Root Beer',
      quantity: 10,
      productID: '444444446',
    },
  ];

  constructor() {
    super(null);
  }

  getShoppingList(filters: {
    name?: string;
  }): Observable<ShoppingList[]> {
    return of(this.testShoppingList);
  }
  deleteItem(id: string): Observable<ShoppingList> {
    let deletedThing: ShoppingList;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0; i < this.testShoppingList.length; i++){
      if(this.testShoppingList[i]._id === id){
        deletedThing = this.testShoppingList.splice(i,1)[0];
      }
    }
    return of(deletedThing);
  }
}
