export interface PantryProduct {
  _id: string;
  product: string;
  name: string;
  category: ProductCategory;
  quantity: number;
}

export type ProductCategory = 'baked goods' | 'produce' | 'meat' | 'dairy' | 'frozen foods' | 'baking supplies'
| 'beverages' | 'cleaning products' | 'miscellaneous' | 'deli'
|'herbs and spices' | 'paper products' | 'pet supplies' | 'staples' | 'toiletries';
