package umm3601.shoppingList;

import static com.mongodb.client.model.Filters.eq;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.regex;

import java.util.regex.Pattern;

import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import umm3601.product.Product;
import umm3601.pantry.PantryItem;

public class ShoppingListController {

  // private static final String PRODUCT_KEY = "product";
  // private static final String PURCHASE_DATE_KEY = "purchase_date";
  // private static final String NOTES_KEY = "notes";

  private static final String NAME_KEY = "name";
  private static final String CATEGORY_KEY = "category";

  private final JacksonMongoCollection<PantryItem> pantryCollection;
  private final JacksonMongoCollection<Product> productCollection;
  private final JacksonMongoCollection<ShoppingList> shoppingListCollection;

  public ShoppingListController(MongoDatabase database) {
    shoppingListCollection = JacksonMongoCollection.builder().build(
        database,
        "shoppingList",
        ShoppingList.class,
        UuidRepresentation.STANDARD);
    pantryCollection = JacksonMongoCollection.builder().build(
        database,
        "pantry",
        PantryItem.class,
        UuidRepresentation.STANDARD);
    productCollection = JacksonMongoCollection.builder().build(
        database,
        "products",
        Product.class,
        UuidRepresentation.STANDARD);
  }

  /**
   * Get the single product specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getShoppingListItemByID(Context ctx) {
    String id = ctx.pathParam("id");
    ShoppingList shoppingList;

    try {
      shoppingList = shoppingListCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested product id wasn't a legal Mongo Object ID.");
    }
    if (shoppingList == null) {
      throw new NotFoundResponse("The requested shoppinglist item(s) could not be found");
    } else {
      ctx.json(shoppingList);
    }
  }

  /**
   * Get a JSON response with a list of all the products.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getAllItems(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the products with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<ShoppingList> matchingItems = shoppingListCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of products returned by
    // the database.
    ctx.json(matchingItems);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
      filters.add(regex(NAME_KEY, Pattern.quote(ctx.queryParam(NAME_KEY)), "i"));
    }

    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(regex(CATEGORY_KEY, Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
    }

    // Combine the list of filters into a single filtering document.
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    // Sort the results. Use the `sortby` query param (default "NAME_KEY")
    // as the field to sort by, and the query param `sortorder` (default
    // "asc") to specify the sort order.
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), NAME_KEY);
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  // Helper function to check if a string is a valid date
  // Format of the date string: yyyy-MM-dd
  private SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy");

  boolean isValidDate(String input) {
    try {
      dateFormat.parse(input);
      return true;
    } catch (ParseException e) {
      return false;
    }
  }

  /**
   * Delete the shoppinglist item specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteShoppingList(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = shoppingListCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the shoppinglist?");
    }
  }

  /**
   * Returns a JSON list of all the shoppinglist entries in the database
   *
   * @param ctx a Javalin HTTP context
   */
  public void getShoppingListInfo(Context ctx) {
    ArrayList<ShoppingList> matchingProducts = shoppingListCollection
        .find()
        .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of products returned by
    // the database.
    ctx.json(matchingProducts);
  }

  public void generateShoppingList(Context ctx) {
    ArrayList<PantryItem> pantryItems = pantryCollection
        .find()
        .into(new ArrayList<>());
    ArrayList<Product> products = productCollection
        .find()
        .into(new ArrayList<>());
    Product[] prodArr = products.toArray(new Product[products.size()]);
    PantryItem[] pantryArr = pantryItems.toArray(new PantryItem[pantryItems.size()]);
    Product[] underThresh = new Product[products.size()];
    int[] quants = new int[products.size()];
    int z = 0;
    for (int i = 0; i < prodArr.length; i++) {
      int tempThresh = prodArr[i].threshold;
      String tempID = prodArr[i]._id;
      int count = 0;
      for (int j = 0; j < pantryArr.length; j++) {
        if (pantryArr[j].product.equals(tempID)) {
          count++;
        }
      }
      if (count < tempThresh) {
        underThresh[z] = prodArr[i];
        quants[z] = tempThresh - count;
        z++;
      }
    }
    shoppingListCollection.deleteMany(new Document());
    for (int i = 0; i < z; i++) {
      ShoppingList listItem = new ShoppingList(underThresh[i]._id, underThresh[i].product_name, quants[i]);
      shoppingListCollection.insertOne(listItem);
    }
  }

}
