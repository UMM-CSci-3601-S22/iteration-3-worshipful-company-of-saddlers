import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ShoppingList } from '../shoppingList';
import { ShoppingListService } from './shoppingList.service';

describe('Shopping List service',() =>{
  const testShoppingList: ShoppingList[] = [
    {
      _id: 'apple_id',
      name:'Apple',
      quantity: 3,
      prodID: '44444444',
    },
    {
      _id: 'orange_id',
      name:'Orange',
      quantity: 4,
      prodID: '444444445',
    },
    {
      _id: 'rootBeer_id',
      name:'Root Beer',
      quantity: 10,
      prodID: '444444446',
    },
  ];
  let shoppingListService: ShoppingListService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    shoppingListService = new ShoppingListService(httpClient);
  });
  afterEach(()=> {
    httpTestingController.verify();
  });

  it('getShoppingList() calls api/shoppingList', () =>{
    shoppingListService.getShoppingList().subscribe(
      items => expect(items).toBe(testShoppingList)
    );

    const req = httpTestingController.expectOne(shoppingListService.shoppingListUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testShoppingList);
  });
  it('getShoppingList() calls api/shoppingList with filter', () => {
    shoppingListService.getShoppingList({ name: 'Apple' }).subscribe(
      shoppingLists => expect(shoppingLists).toBe(testShoppingList)
    );

    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(shoppingListService.shoppingListUrl) && request.params.has('name'));

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('name')).toEqual('Apple');
    req.flush(testShoppingList);
  });
  it('getShoppingListById() calls api/shoppingList/id', () => {
    const targetShoppingList: ShoppingList = testShoppingList[1];
    const targetId: string = targetShoppingList._id;
    shoppingListService.getShoppingListById(targetId).subscribe(
      shoppingList => expect(shoppingList).toBe(targetShoppingList)
    );
    const expectedUrl: string = shoppingListService.shoppingListUrl + '/'+ targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetShoppingList);
  });
  it('addShoppingList() calls api/shoppingList/id', () => {
    shoppingListService.addShoppingList(testShoppingList[1]).subscribe(
      id => expect(id).toBe('testid')
    );
    const req = httpTestingController.expectOne(shoppingListService.shoppingListUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testShoppingList[1]);
  });
});

