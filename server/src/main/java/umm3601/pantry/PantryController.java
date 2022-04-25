package umm3601.pantry;

import static com.mongodb.client.model.Filters.eq;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import java.io.*;
import java.lang.Thread;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.regex;

import java.util.regex.Pattern;

import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import umm3601.product.Product;

public class PantryController {

  // private static final String PRODUCT_KEY = "product";
  // private static final String PURCHASE_DATE_KEY = "purchase_date";
  // private static final String NOTES_KEY = "notes";

  private static final String NAME_KEY = "name";
  private static final String CATEGORY_KEY = "category";

  private final JacksonMongoCollection<PantryItem> pantryCollection;
  private final JacksonMongoCollection<Product> productCollection;
  private final JacksonMongoCollection<PantryProduct> ppCollection;

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
    ppCollection = JacksonMongoCollection.builder().build(
        database,
        "pantryProduct",
        PantryProduct.class,
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
    ArrayList<PantryItem> matchingItems = pantryCollection
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
        /*
         * .check(item -> item.category != null && item.category.length() > 0,
         * "Pantry item must have a non-empty category")
         */
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

  public void aggregateNewDatabase(Context ctx) {
    ArrayList<PantryItem> pantryItems = pantryCollection
        .find()
        .into(new ArrayList<>());
    PantryItem[] pantryArr = pantryItems.toArray(new PantryItem[pantryItems.size()]);
    PantryItem[] reflection = new PantryItem[pantryArr.length];
    int[] tracker = new int[pantryArr.length];
    int foundCounter = 1;
    reflection[0] = pantryArr[0];
    tracker[0] = 1;
    for (int i = 1; i < pantryArr.length; i++) {
      for (int j = 0; j < reflection.length; j++) {
        if (reflection[j] != null && reflection[j].product.equals(pantryArr[i].product)) {
          tracker[j] = tracker[j] + 1;
          break;
        } else if (j == reflection.length - 1) {
          reflection[foundCounter] = pantryArr[i];
          tracker[foundCounter] = 1;
          foundCounter++;
        }
      }

    }
    // try {
    //   Thread.sleep(2000);
    // } catch (Exception e) {

    //   // catching the exception
    //   System.out.println(e);
    // }

    ppCollection.deleteMany(new Document());
    for (int i = 0; i < foundCounter; i++) {
      PantryProduct product = new PantryProduct(reflection[i].product, reflection[i].name, tracker[i],
          reflection[i].category);
      ppCollection.insertOne(product);
    }
  }

  /**
   * Get a JSON response with a list of all the products.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getAllPantryProducts(Context ctx) {
    ppCollection.deleteMany(new Document());
    aggregateNewDatabase(ctx);
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the products with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<PantryProduct> matchingItems = ppCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of products returned by
    // the database.
    ctx.json(matchingItems);
  }
}
