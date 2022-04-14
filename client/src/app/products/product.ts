export interface Product {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  product_name: string; // Client filter
  description?: string; // Client filter
  brand: string; // client filter
  category: ProductCategory; // server filter
  store: string; // server filter
  location?: string; // client filter
  notes?: string; // server filter
  lifespan?: number; // server filter
  threshold?: number; // server filter
  image?: string; // server filter
}

// eslint-disable-next-line max-len
export type ProductCategory = 'baked goods' | 'produce' | 'meat' | 'dairy' | 'frozen foods' | 'baking supplies'
| 'beverages' | 'cleaning products' | 'miscellaneous' | 'deli'
|'herbs and spices' | 'paper products' | 'pet supplies' | 'staples' | 'toiletries';
