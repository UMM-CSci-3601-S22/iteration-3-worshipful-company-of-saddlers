/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../products/product';

import { PantryService } from './pantry.service';
import { PantryItem } from './pantryItem';
import { PantryProduct } from './pantryProduct';

describe('PantryService', () => {

  const testPantryProducts: PantryProduct[] = [
    {
      _id: 'banana _id',
      product: 'banana product id',
      name: 'banana',
      category: 'produce',
      quantity: 4,
    },
    {
      _id: 'milk _id',
      product: 'milk product id',
      name: 'milk',
      category: 'dairy',
      quantity: 6,
    },
    {
      _id: 'bread _id',
      product: 'bread product id',
      name: 'bread',
      category: 'baked goods',
      quantity: 1,
    }
  ];

  const testProducts: Product[] = [
    {
      _id: 'banana_id',
      product_name: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Willies',
      location: '',
      notes: '',
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'milk_id',
      product_name: 'Whole Milk',
      description: '',
      brand: 'Land O Lakes',
      category: 'dairy',
      store: 'Willies',
      location: '',
      notes: '',
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'bread_id',
      product_name: 'Wheat Bread',
      description: '',
      brand: 'Country Hearth',
      category: 'baked goods',
      store: 'Pomme de Terre',
      location: '',
      notes: '',
      lifespan: 0,
      threshold: 0,
      image: ''
    }
  ];

  const newProduct: PantryItem =
  {
    _id: 'new_id',
    product: 'new product id',
    name: 'new product name',
    category: 'produce',
    purchase_date: new Date('2037-05-12T05:00:00.000Z'),
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

  it('getPantryItems() calls api/pantryItems with filter param category \' deli\'', () => {
    pantryService.getPantryItems({category: 'deli'}).subscribe(
      pantryItems => expect(pantryItems).toBe(testPantryProducts)
    );

    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(pantryService.pantryUrl) && request.params.has('category')
    );

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('category')).toEqual('deli');

    req.flush(testPantryProducts);
  });

  it('getPantryItems() calls api/pantryItems with filter param name \'bread\'', () => {
    pantryService.getPantryItems({name: 'bread'}).subscribe(
      pantryItems => expect(pantryItems).toBe(testPantryProducts)
    );

    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(pantryService.pantryUrl) && request.params.has('name')
    );

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('name')).toEqual('bread');

    req.flush(testPantryProducts);
  });

  it('filterItems filters items by name param \'bread\'', () => {
    expect(testPantryProducts.length).toBe(3);
    const name = 'bread';
    expect(pantryService.filterPantryProducts(testPantryProducts, { name: name }).length).toBe(1);
  });

  it('filterItems filters items by name param \'b\'', () => {
    expect(testPantryProducts.length).toBe(3);
    const name = 'b';
    expect(pantryService.filterPantryProducts(testPantryProducts, { name: name }).length).toBe(2);
  });

  it('filterItems filters items by category param \'produce\'', () => {
    expect(testPantryProducts.length).toBe(3);
    const category = 'produce';
    expect(pantryService.filterPantryProducts(testPantryProducts, { category: category }).length).toBe(1);
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

  it('getProducts() calls api/products with filter parameter \'produce\'', () => {

    pantryService.getProducts({ category: 'produce' }).subscribe(
      products => expect(products).toBe(testProducts)
    );

    // Specify that (exactly) one request will be made to the specified URL with the category parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(pantryService.productUrl) && request.params.has('category')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('category')).toEqual('produce');

    req.flush(testProducts);
  });

  it('getProducts() calls api/products with filter store parameter \'willies\'', () => {

    pantryService.getProducts({ store: 'willies' }).subscribe(
      products => expect(products).toBe(testProducts)
    );

    // Specify that (exactly) one request will be made to the specified URL with the category parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(pantryService.productUrl) && request.params.has('store')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('store')).toEqual('willies');

    req.flush(testProducts);
  });

  it('getProductById() calls api/products/id', () => {
    const targetProduct: Product = testProducts[1];
    const targetId: string = targetProduct._id;
    pantryService.getProductById(targetId).subscribe(
      product => expect(product).toBe(targetProduct)
    );

    const expectedUrl: string = pantryService.productUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetProduct);
  });
/*
  it('deleteItem() deletes from api/pantry', () => {
    const targetItem: PantryItem = testPantryProducts[1];
    const targetId: string = targetItem._id;
    pantryService.deleteItem(targetId).subscribe(
      item => expect(item).toBe(targetItem)
    );

    const expectedUrl: string = pantryService.pantryUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('DELETE');
    req.flush(targetItem);
  });
*/
});
