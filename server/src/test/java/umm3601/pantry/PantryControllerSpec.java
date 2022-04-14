package umm3601.pantry;

import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.core.JavalinConfig;
import io.javalin.core.validation.ValidationException;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.http.HttpCode;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;
import umm3601.product.Product;

/**
 * Tests the logic of the PantryController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber", "NoWhitespaceAfter" })
public class PantryControllerSpec {

  // Mock requests and responses that will be reset in `setupEach()`
  // and then (re)used in each of the tests.
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private PantryController pantryController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId appleEntryId;
  private ObjectId bananaEntryId;
  private ObjectId beansEntryId;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method. It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   */
  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void setupEach() throws IOException {
    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup products collection in the database
    MongoCollection<Document> productDocuments = db.getCollection("products");
    productDocuments.drop();
    // Setup pantry collection in the database
    MongoCollection<Document> pantryDocuments = db.getCollection("pantry");
    pantryDocuments.drop();

    // Add test products to the database
    List<Document> testProducts = new ArrayList<>();
    bananaEntryId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", bananaEntryId)
            .append("product_name", "Banana")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Willies")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("lifespan", 4)
            .append("threshold", 40));
    beansEntryId = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", beansEntryId)
            .append("product_name", "Canned Pinto Beans")
            .append("description", "A can of pinto beans")
            .append("brand", "Our Family")
            .append("category", "canned goods")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 2000)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("lifespan", 4)
            .append("threshold", 4));

    productDocuments.insertMany(testProducts);

    // Add test pantry entries to the database
    List<Document> testPantryEntries = new ArrayList<>();
    testPantryEntries.add(
        new Document()
            .append("product", bananaEntryId.toHexString()) // oid of banana
            .append("purchase_date", "2022-03-01")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("name", "Banana")
            .append("category", "produce"));
    // Set up two instances beans entered at different dates
    testPantryEntries.add(
        new Document()
            .append("product", beansEntryId.toHexString()) // oid of beans
            .append("purchase_date", "2022-02-01")
            .append("notes", "My cool product notes.")
            .append("name", "Beans")
            .append("category", "staples"));
    testPantryEntries.add(
        new Document()
            .append("product", beansEntryId.toHexString()) // oid of beans
            .append("purchase_date", "2022-03-01")
            .append("notes", "My other cool product notes.")
            .append("name", "Beans")
            .append("category", "staples"));

    pantryDocuments.insertMany(testPantryEntries);

    // Entry just to test getById()
    appleEntryId = new ObjectId();
    Document apple = new Document()
        .append("_id", appleEntryId)
        .append("product", bananaEntryId.toHexString())
        .append("purchase_date", "2023-01-27")
        .append("notes", "check on gerbils every 3 days")
        .append("name", "Apple")
        .append("category", "produce");

    pantryDocuments.insertOne(apple);

    pantryController = new PantryController(db);
  }

  /**
   * Construct an instance of `Context` using `ContextUtil`, providing
   * a mock context in Javalin. See `mockContext(String, Map)` for
   * more details.
   */
  private Context mockContext(String path) {
    return mockContext(path, Collections.emptyMap());
  }

  /**
   * Construct an instance of `Context` using `ContextUtil`, providing a mock
   * context in Javalin. We need to provide a couple of attributes, which is
   * the fifth argument, which forces us to also provide the (default) value
   * for the fourth argument. There are two attributes we need to provide:
   *
   * - One is a `JsonMapper` that is used to translate between POJOs and JSON
   * objects. This is needed by almost every test.
   * - The other is `maxRequestSize`, which is needed for all the ADD requests,
   * since `ContextUtil` checks to make sure that the request isn't "too big".
   * Those tests fails if you don't provide a value for `maxRequestSize` for
   * it to use in those comparisons.
   */
  private Context mockContext(String path, Map<String, String> pathParams) {
    return ContextUtil.init(
        mockReq, mockRes,
        path,
        pathParams,
        HandlerType.INVALID,
        Map.ofEntries(
            entry(JSON_MAPPER_KEY, javalinJackson),
            entry(ContextUtil.maxRequestSizeKey,
                new JavalinConfig().maxRequestSize)));
  }

  /**
   * A little helper method that assumes that the given context
   * body contains an array of PantryItems, and extracts and returns
   * that array.
   *
   * @param ctx the `Context` whose body is assumed to contain
   *            an array of `PantryItem`s.
   * @return the array of `PantryItem`s from the given `Context`.
   */
  private PantryItem[] returnedPantryItems(Context ctx) {
    String result = ctx.resultString();
    PantryItem[] pantryItems = javalinJackson.fromJsonString(result, PantryItem[].class);
    return pantryItems;
  }

  public Product[] returnedProducts(Context ctx) {
    String result = ctx.resultString();
    Product[] products = javalinJackson.fromJsonString(result, Product[].class);
    return products;
  }

  @Test
  public void canGetAllPantryItems() throws IOException {
    // Create our fake Javalin context
    String path = "api/pantry";
    Context ctx = mockContext(path);

    pantryController.getAllItems(ctx);
    PantryItem[] returnedPantryItems = returnedPantryItems(ctx);

    // The response status should be 200, i.e., our request.append("_id", milksId)
    // was handled successfully (was OK). This is a named constant in
    // the class HttpCode.
    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(
        db.getCollection("pantry").countDocuments(),
        returnedPantryItems.length);
  }

  /**
   * A little helper method that assumes that the given context
   * body contains a *single* PantryItem, and extracts and returns
   * that PantryItem.
   *
   * @param ctx the `Context` whose body is assumed to contain
   *            a *single* `PantryItem`.
   * @return the `PantryItem` extracted from the given `Context`.
   */
  private PantryItem returnedSinglePantryItem(Context ctx) {
    String result = ctx.resultString();
    PantryItem pantryItem = javalinJackson.fromJsonString(result, PantryItem.class);
    return pantryItem;
  }

  @Test
  void testGetPantryItemByID() {

    String testID = appleEntryId.toHexString();
    Context ctx = mockContext("api/pantry/{id}", Map.of("id", testID));

    pantryController.getPantryItemByID(ctx);
    PantryItem resultProduct = returnedSinglePantryItem(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    assertEquals(appleEntryId.toHexString(), resultProduct._id);
    assertEquals(bananaEntryId.toHexString(), resultProduct.product);

  }

  @Test
  public void getPantryItemByIdBadRequestResponse() throws IOException {
    Context ctx = mockContext("api/pantry/{id}", Map.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      pantryController.getPantryItemByID(ctx);
    });
  }

  @Test
  public void getPantryItemByIdNotFoundResponse() throws IOException {
    Context ctx = mockContext("api/pantry/{id}", Map.of("id", "6224ba3bfc13ae3ac400000d"));

    assertThrows(NotFoundResponse.class, () -> {
      pantryController.getPantryItemByID(ctx);
    });
  }

  @Test
  public void canGetAllProducts() throws IOException {
    // Create our fake Javalin context
    String path = "api/pantry";
    Context ctx = mockContext(path);

    pantryController.getAllProductsInPantry(ctx);
    PantryItem[] returnedProducts = returnedPantryItems(ctx);

    // The response status should be 200, i.e., our request
    // was handled successfully (was OK). This is a named constant in
    // the class HttpCode.
    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(
        db.getCollection("pantry").countDocuments(),
        returnedProducts.length);
  }

  @Test
  public void badRequestResponseGetAllProducts() throws IOException {
    // Create our fake Javalin context
    String path = "api/pantry";
    Context ctx = mockContext(path);

    MongoCollection<Document> pantryDocuments = db.getCollection("pantry");
    // add a bad product _id to the pantry
    Document apple = new Document()
        .append("product", "bad")
        .append("purchase_date", "2023-01-27")
        .append("notes", "check on gerbils every 3 days")
        .append("name", "Apple")
        .append("category", "produce");

    pantryDocuments.insertOne(apple);

    assertThrows(BadRequestResponse.class, () -> {
      pantryController.getAllProductsInPantry(ctx);
    });

  }

  @Test
  public void notFoundResponseGetAllProducts() throws IOException {
    // Create our fake Javalin context
    String path = "api/pantry";
    Context ctx = mockContext(path);

    MongoCollection<Document> pantryDocuments = db.getCollection("pantry");
    // add a product with valid oid to the pantry,
    // but isnot in the product collection
    Document apple = new Document()
        .append("product", "6224ba3bfc13ae3ac400000a")
        .append("purchase_date", "2023-01-27")
        .append("notes", "check on gerbils every 3 days")
        .append("name", "Apple")
        .append("category", "produce");

    pantryDocuments.insertOne(apple);

    assertThrows(NotFoundResponse.class, () -> {
      pantryController.getAllProductsInPantry(ctx);
    });

  }

  @Test
  public void addProduct() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"name\": \"Banana\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\","
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    pantryController.addNewPantryItem(ctx);
    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    // Our status should be 201, i.e., our new product was successfully
    // created. This is a named constant in the class HttpURLConnection.
    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Successfully adding the product should return the newly generated MongoDB ID
    // for that product.
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("pantry").countDocuments(eq("_id", new ObjectId(id))));

    // Verify that the product was added to the database with the correct ID
    Document addedProduct = db.getCollection("pantry").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedProduct);
    assertEquals(bananaEntryId.toHexString(), addedProduct.getString("product"));
    assertEquals("Banana", addedProduct.getString("name"));
    assertEquals("2023-01-27", addedProduct.getString("purchase_date"));
    assertEquals("check on gerbils every 3 days", addedProduct.getString("notes"));
    assertEquals("produce", addedProduct.getString("category"));
  }

  @Test
  public void addItemWithBadProduct() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"6224ba3bfc13ae3ac400000e\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithNullProduct() throws IOException {

    String testNewEntry = "{"
        + "\"product\": null,"
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithEmptyProduct() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithBadDate() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"01272023\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithNullDate() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": null,"
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithEmptyDate() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithBadNote() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": null"
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithEmptyNote() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithBadName() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": null"
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithEmptyName() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"\""
        + "\"category\": \"produce\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithBadCategory() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"forklift\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void addItemWithEmptyCategory() throws IOException {

    String testNewEntry = "{"
        + "\"product\": \"" + bananaEntryId.toHexString() + "\","
        + "\"purchase_date\": \"2023-01-27\","
        + "\"notes\": \"check on gerbils every 3 days\""
        + "\"name\": \"Banana Phone\""
        + "\"category\": \"\""
        + "}";

    mockReq.setBodyContent(testNewEntry);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/pantry");

    assertThrows(ValidationException.class, () -> {
      pantryController.addNewPantryItem(ctx);
    });
  }

  @Test
  public void deletePantryItem() throws IOException {
    String testID = appleEntryId.toHexString();

    // Product exists before deletion
    assertEquals(1, db.getCollection("pantry").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = mockContext("api/pantry/{id}", Map.of("id", testID));

    pantryController.deletePantryItem(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());

    // Product is no longer in the database
    assertEquals(0, db.getCollection("pantry").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  public void deletePantryItemNotFoundResponse() throws IOException {
    String testID = "588935f57546a2daea44de7c";

    // Product exists before deletion
    assertEquals(0, db.getCollection("pantry").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = mockContext("api/pantry/{id}", Map.of("id", testID));

    assertThrows(NotFoundResponse.class, () -> {
      pantryController.deletePantryItem(ctx);
    });
  }

  @Test
  public void canGetPantryInfo() throws IOException {
    // Create our fake Javalin context
    String path = "api/pantry/info";
    Context ctx = mockContext(path);

    pantryController.getPantryInfo(ctx);
    PantryItem[] returnedProducts = returnedPantryItems(ctx);

    // The response status should be 200, i.e., our request.append("_id", milksId)
    // was handled successfully (was OK). This is a named constant in
    // the class HttpCode.
    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(
        db.getCollection("pantry").countDocuments(),
        returnedProducts.length);
  }

  @Test
  public void filterByCategory() throws IOException {
    mockReq.setQueryString("category=staples");
    String path = "api/pantry";
    Context ctx = mockContext(path);

    pantryController.getAllItems(ctx);
    PantryItem[] returnedItems = returnedPantryItems(ctx);

    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(2, returnedItems.length);
  }

  @Test
  public void filterByName() throws IOException {
    mockReq.setQueryString("name=Beans");
    String path = "api/pantry";
    Context ctx = mockContext(path);

    pantryController.getAllItems(ctx);
    PantryItem[] returnedItems = returnedPantryItems(ctx);

    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(2, returnedItems.length);
  }

  @Test
  public void filterByNameAndCategory() throws IOException {
    mockReq.setQueryString("name=Beans&category=staples");
    String path = "api/pantry";
    Context ctx = mockContext(path);

    pantryController.getAllItems(ctx);
    PantryItem[] returnedItems = returnedPantryItems(ctx);

    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(2, returnedItems.length);
  }
}
