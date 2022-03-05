export interface Product {
  _id: string;
  productName: string; // Client filter
  description?: string; // Client filter
  brand: string; // client filter
  category: ProductCategory; // server filter
  store: string; // server filter
  location?: string; // client filter
  notes?: string; // server filter
  tags?: string[]; // client filter
  lifespan?: number; // server filter
  threshold?: number; // server filter
  image?: File; // server filter
}

export type ProductCategory = 'bakery' | 'produce' | 'meat' | 'diary' | 'frozen foods' | 'canned goods' | 'drinks' | 'miscellaneous';
