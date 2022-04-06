/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../products/product';

import { PantryService } from './pantry.service';
import { PantryItem } from './pantryItem';

describe('PantryService', () => {

  const testPantryProducts: PantryItem[] = [
    {
      _id: 'banana _id',
      product: 'banana product id',
      name: 'banana',
      category: 'produce',
      purchase_date: '01-02-2022',
      notes: 'notes for banana pantry item'
    },
    {
      _id: 'milk _id',
      product: 'milk product id',
      name: 'milk',
      category: 'dairy',
      purchase_date: '02-02-2022',
      notes: 'notes for milk pantry item'
    },
    {
      _id: 'bread _id',
      product: 'bread product id',
      name: 'bread',
      category: 'baked goods',
      purchase_date: '03-02-2022',
      notes: 'notes for bread pantry item'
    }
  ];

  const newProduct: PantryItem =
  {
    _id: 'new_id',
    product: 'new product id',
    name: 'new product name',
    category: 'produce',
    purchase_date: '04-05-2022',
    notes: 'this is a new product in the pantry'
  };

  let pantryService: PantryService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    pantryService = new PantryService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });


  it('getPantryItems() calls api/pantry', () => {
    // Assert that the products we get from this call to getPantryItems()
    // should be our set of test products. Because we're subscribing
    // to the result of getPantryItems(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testPantryProducts) a few lines
    // down.
    pantryService.getPantryItems().subscribe(
      products => expect(products).toBe(testPantryProducts)
    );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(pantryService.pantryUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testPantryProducts);

  });


  it('addPantryItem() posts to api/pantry', () => {
    // Assert that the products that we add to the pantry are actually added
    // to the pantry.
    pantryService.addPantryItem(newProduct).subscribe(
      id => expect(id).toBe('new_id')
    );

    const req = httpTestingController.expectOne(pantryService.pantryUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newProduct);

    req.flush({id: 'new_id'});
  });

});
