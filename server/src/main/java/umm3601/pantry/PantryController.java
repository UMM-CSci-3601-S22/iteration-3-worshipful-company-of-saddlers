package umm3601.pantry;

import static com.mongodb.client.model.Filters.eq;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;
import umm3601.product.Product;

public class PantryController {

  // private static final String PRODUCT_KEY = "product";
  // private static final String PURCHASE_DATE_KEY = "purchase_date";
  // private static final String NOTES_KEY = "notes";

  private final JacksonMongoCollection<PantryItem> pantryCollection;
  private final JacksonMongoCollection<Product> productCollection;

  public PantryController(MongoDatabase database) {
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
  public void getPantryItemByID(Context ctx) {
    String id = ctx.pathParam("id");
    PantryItem pantryItem;

    try {
      pantryItem = pantryCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested product id wasn't a legal Mongo Object ID.");
    }
    if (pantryItem == null) {
      throw new NotFoundResponse("The requested pantry item(s) could not be found");
    } else {
      ctx.json(pantryItem);
    }
  }

  /**
   * Get a JSON response with a list of all the products in pantry.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getAllProductsInPantry(Context ctx) {
    ArrayList<PantryItem> pantryItems = pantryCollection
        .find()
        .into(new ArrayList<>());

    List<Product> products;
    try {
      products = pantryItems.stream()
          .map(item -> productCollection.find(eq("_id", new ObjectId(item.product))).first())
          .collect(Collectors.toList());
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested pantry item's id wasn't a legal Mongo Object ID.");
    }
    // Checks if any product is null, which means that
    // at least one product was not in the database
    if (products.stream().anyMatch(Objects::isNull)) {
      throw new NotFoundResponse("There are products(s) in the pantry could not be found.");
    } else {
      ctx.json(pantryItems);
    }

  }

  // Helper function to check if a string is a valid date
  // Format of the date string: yyyy-MM-dd
  private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

  boolean isValidDate(String input) {
    try {
      dateFormat.parse(input);
      return true;
    } catch (ParseException e) {
      return false;
    }
  }

  /**
   * Checks if the given entry exists with a given id. if no such entry exists
   * returns false. Returns true for one or more entry with a matching
   * id.
   *
   * @param id
   * @return boolean - true if one or more functions with matching names exit.
   */
  private boolean productExists(String id) {
    Product product;

    try {
      product = productCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      return false;
    }
    if (product == null) {
      return false;
    }
    return true;
  }

  /**
   * Get a JSON response with a list of all the products.
   *
   * @param ctx a Javalin HTTP context
   */
  @SuppressWarnings({ "MagicNumber" })
  public void addNewPantryItem(Context ctx) {

    int notesCharacterLimit = 500;

    PantryItem newPantryItem = ctx.bodyValidator(PantryItem.class)
        .check(item -> productExists(item.product), "error: product does not exist")
        .check(item -> ObjectId.isValid(item.product), "The product id is not a legal Mongo Object ID.")
        .check(item -> item.notes != null && item.notes.length() <= notesCharacterLimit,
            "Pantry item notes cannot be null")
        .check(item -> isValidDate(item.purchase_date), "The date is not in the correct format")
        .get();

    pantryCollection.insertOne(newPantryItem);

    // 201 is the HTTP code for when we successfully
    // create a new resource (a pantry item in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpCode.CREATED);
    ctx.json(Map.of("id", newPantryItem._id));
  }

  /**
   * Delete the pantry item specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deletePantryItem(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = pantryCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the pantry?");
    }
  }

  /**
   * Returns a JSON list of all the pantry entries in the database
   *
   * @param ctx a Javalin HTTP context
   */
  public void getPantryInfo(Context ctx) {
    ArrayList<PantryItem> matchingProducts = pantryCollection
        .find()
        .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of products returned by
    // the database.
    ctx.json(matchingProducts);
  }

}
