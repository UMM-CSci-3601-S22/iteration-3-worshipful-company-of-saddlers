package umm3601.pantry;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;

public class PantryController {

  private static final String PRODUCT_KEY = "product";
  private static final String PURCHASE_DATE_KEY = "purchase_date";
  private static final String NOTES_KEY = "notes";

  private final JacksonMongoCollection<PantryItem> pantryCollection;

  public PantryController(MongoDatabase database) {
    pantryCollection = JacksonMongoCollection.builder().build(
        database,
        "pantry",
        PantryItem.class,
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
}
