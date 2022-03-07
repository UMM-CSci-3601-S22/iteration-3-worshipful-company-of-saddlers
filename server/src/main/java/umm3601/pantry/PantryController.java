package umm3601.pantry;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.eclipse.jetty.util.ajax.JSON;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;
import umm3601.product.Product;
import umm3601.product.ProductController;

public class PantryController {

  private static final String PRODUCT_KEY = "product";
  private static final String PURCHASE_DATE_KEY = "purchase_date";
  private static final String NOTES_KEY = "notes";

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
      throw new NotFoundResponse("The requested product was not found");
    } else {
      ctx.json(pantryItem);
    }
  }

  /**
   * Get a JSON response with a list of all the products.
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
          .map(item -> productCollection.find(eq("_id", new ObjectId(item._id))).first())
          .collect(Collectors.toList());
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested pantry item's id wasn't a legal Mongo Object ID.");
    }if (products == null) {
      throw new NotFoundResponse("The requested pantry item(s) could not be found.");
    } else {
      ctx.json(products);
    }

  }

}
