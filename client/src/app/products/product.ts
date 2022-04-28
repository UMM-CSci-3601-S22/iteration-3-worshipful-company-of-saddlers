export interface Product {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  product_name: string; // Client filter
  description?: string; // Client filter
  brand: string; // client filter
  category: ProductCategory; // server filter
  store: ProductStore; // server filter
  location?: string; // client filter
  notes?: string; // server filter
  lifespan?: number; // server filter
  threshold?: number; // server filter
  image?: string; // server filter
}

export const categories =
  ['baked goods', 'produce', 'meat', 'dairy', 'frozen foods',
   'baking supplies', 'beverages', 'cleaning products', 'miscellaneous', 'deli',
   'herbs and spices', 'paper products', 'pet supplies', 'staples', 'toiletries'] as const;
export type ProductCategory = typeof categories[number];

export const categoryCamelCase = (category: ProductCategory) => {
  // This is essentially a hack to handle all the categories with spaces
  // in them. One could have done that programmatically, but I didn't want
  // to add that computational overhead given how often this will be called.
  // I suspect there's a better solution, TBH.
  const categoryMap = {
    'baked goods': 'bakedGoods',
    'frozen foods': 'frozenFoods',
    'baking supplies': 'bakingSupplies',
    'cleaning products': 'cleaningProducts',
    'herbs and spices': 'herbsAndSpices',
    'paper products': 'paperProducts',
    'pet supplies': 'petSupplies'
  };
  let categoryPrefix: string;
  if (categoryMap[category]) {
    categoryPrefix = categoryMap[category];
  } else {
    categoryPrefix = category;
  }
  // I don't know if we want/need to add 'Items' here. It was needed everywhere
  // I called this from, but I can imagine that if you generalized this idea
  // you might have uses that don't want 'Items' at the end. If so, then you
  // want to move the addition of 'Items' to the places where it's necessary
  // instead of having it here.
  return categoryPrefix + 'Products';
};

export const categoryTitleCase = (category: ProductCategory) => {

  const categoryMap = {
    'baked goods': 'Baked Goods',
    produce: 'Produce',
    meat: 'Meat',
    dairy: 'Dairy',
    'frozen foods': 'Frozen Foods',
    'baking supplies': 'Baking Supplies',
    beverages: 'Beverages',
    'cleaning products': 'Cleaning Products',
    miscellaneous: 'Miscellaneous',
    deli: 'Deli',
    'herbs and spices': 'Herbs And Spices',
    'paper products': 'Paper Products',
    'pet supplies': 'Pet Supplies',
    staples: 'Staples',
    toiletries: 'Toiletries'
  };
  let categoryPrefix: string;
  if (categoryMap[category]) {
    categoryPrefix = categoryMap[category];
  } else {
    categoryPrefix = category;
  }
  return categoryPrefix;
};

export type ProductStore = 'Willies' | 'Pomme de Terre' | 'Pomme de Terre/Willies' | 'Real Food Hub' | 'Other';
