export interface PantryItem {
  _id: string;
  product: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  purchase_date: string;
  notes?: string;
  name: string;
  category: ProductCategory;
}

export type ProductCategory = 'baked goods' | 'produce' | 'meat' | 'dairy' | 'frozen foods' | 'baking supplies'
| 'beverages' | 'cleaning products' | 'miscellaneous' | 'deli'
|'herbs and spices' | 'paper products' | 'pet supplies' | 'staples' | 'toiletries';
