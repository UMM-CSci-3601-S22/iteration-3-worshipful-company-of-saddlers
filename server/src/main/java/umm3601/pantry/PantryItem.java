package umm3601.pantry;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class PantryItem {
  @ObjectId
  @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  @SuppressWarnings({ "MemberName" })
  public String _id;
  public String product;
  public String purchase_date;
  public String notes;
}
