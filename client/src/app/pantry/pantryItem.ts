export interface PantryItem {
  _id: string;
  product: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  purchase_date: string;
  notes?: string;
  name: string;
  category: string;
}
