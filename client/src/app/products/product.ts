export interface Product {
  _id: string;
  productName: string;
  description?: string;
  brand: string;
  category: ProductCategory;
  store: string;
  location?: string;
  notes?: string;
  tags?: string[];
  lifespan?: number;
  threshold?: number;
  image?: File;
}

export type ProductCategory = 'bakery' | 'produce' | 'meat' | 'diary' | 'frozen foods' | 'canned goods' | 'drinks' | 'miscellaneous';
