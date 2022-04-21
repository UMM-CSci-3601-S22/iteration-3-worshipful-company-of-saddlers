package umm3601.shoppingList;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({ "VisibilityModifier", "MemberName" })
public class ShoppingList {
  @ObjectId
  @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  public String _id;
  public String productID;
  public String name;
  public int quantity;

  ShoppingList() {
  }

  ShoppingList(String id, String name, int quantity) {
    this.productID = id;
    this.name = name;
    this.quantity = quantity;
  }
}
