package umm3601.shoppinglisttest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJackson;
import umm3601.shoppingList.ShoppingList;
import umm3601.shoppingList.ShoppingListController;

@SuppressWarnings({ "MagicNumber", "NoWhitespaceAfter" })
public class ShoppingListControllerSpec {
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ShoppingListController shoppingListController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId fruitID;
  private ObjectId saladID;
  private ObjectId testID;
  private ObjectId testID2;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();
  private MongoCollection<Document> shoppingListDocuments;

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

    // Setup database
    MongoCollection<Document> productDocuments = db.getCollection("products");
    productDocuments.drop();
    List<Document> testProducts = new ArrayList<>();
    fruitID = new ObjectId();
    saladID = new ObjectId();
    testProducts.add(
        new Document()
            .append("_id", fruitID)
            .append("product_name", "Fruit")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Willies")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("lifespan", 4)
            .append("threshold", 5));
    testProducts.add(
        new Document()
            .append("_id", saladID)
            .append("product_name", "Salad")
            .append("description", "A can of pinto beans")
            .append("brand", "Our Family")
            .append("category", "beverages")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 2000)
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("lifespan", 4)
            .append("threshold", 3));

    MongoCollection<Document> pantryDocuments = db.getCollection("pantry");
    pantryDocuments.drop();
    List<Document> testPantry = new ArrayList<>();
    testPantry.add(
        new Document()
            .append("product", fruitID)
            .append("purchase_date", "1/10/2020")
            .append("name", "Fruit")
            .append("category", "produce")
            .append("notes", "I eat these with toothpaste, yum-yum."));
    testPantry.add(
        new Document()
            .append("product", saladID)
            .append("purchase_date", "1/20/2120")
            .append("name", "Salad")
            .append("category", "produce")
            .append("notes", "poggers"));
    testPantry.add(
        new Document()
            .append("product", saladID)
            .append("purchase_date", "1/20/2120")
            .append("name", "Salad")
            .append("category", "produce")
            .append("notes", "poggers"));
    testPantry.add(
        new Document()
            .append("product", saladID)
            .append("purchase_date", "1/20/2120")
            .append("name", "Salad")
            .append("category", "produce")
            .append("notes", "poggers"));
    shoppingListDocuments = db.getCollection("shoppingList");
    shoppingListDocuments.drop();

    productDocuments.insertMany(testProducts);
    pantryDocuments.insertMany(testPantry);
    shoppingListController = new ShoppingListController(db);
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
   * body contains an array of Products, and extracts and returns
   * that array.
   *
   * @param ctx the `Context` whose body is assumed to contain
   *            an array of `Product`s.
   * @return the array of `Product`s from the given `Context`.
   */
  private ShoppingList[] returnedShoppingList(Context ctx) {
    String result = ctx.resultString();
    ShoppingList[] products = javalinJackson.fromJsonString(result, ShoppingList[].class);
    return products;
  }

  /**
   * A little helper method that assumes that the given context
   * body contains a *single* Product, and extracts and returns
   * that Product.
   *
   * @param ctx the `Context` whose body is assumed to contain
   *            a *single* `Product`.
   * @return the `Product` extracted from the given `Context`.
   */
  private ShoppingList returnedSingleShoppingList(Context ctx) {
    String result = ctx.resultString();
    ShoppingList product = javalinJackson.fromJsonString(result, ShoppingList.class);
    return product;
  }

  @Test
  public void generateTest() throws IOException {
    Context ctx = mockContext("api/generateTest");
    shoppingListController.generateShoppingList(ctx);
    shoppingListController.getShoppingLists(ctx);
    ShoppingList[] returnedShoppingList = returnedShoppingList(ctx);
    assertEquals(
        db.getCollection("shoppingList").countDocuments(),
        returnedShoppingList.length);
    assertEquals(returnedShoppingList[0].quantity, 4);
    assertEquals(returnedShoppingList[0].name, "Fruit");
  }

  @Test
  public void getShoppingListItemWithExistentId() throws IOException {
    testID = new ObjectId();
    testID2 = new ObjectId();
    Document salad = new Document()
        .append("_id", testID)
        .append("name", "salad")
        .append("productID", testID2)
        .append("quantity", 3);
    shoppingListDocuments.insertOne(salad);
    String testid = testID.toHexString();
    Context ctx = mockContext("api/shoppingList/{id}", Map.of("id", testid));

    shoppingListController.getShoppingList(ctx);
    ShoppingList resultProduct = returnedSingleShoppingList(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    assertEquals(testID.toHexString(), resultProduct._id);
    assertEquals("salad", resultProduct.name);
  }

  @Test
  public void getShoppingListItemWithBadId() throws IOException {
    testID = new ObjectId();
    String testid = testID.toHexString();
    Context ctx = mockContext("api/shoppingList/{id}", Map.of("id", testid));
    assertThrows(NotFoundResponse.class, () -> {
      shoppingListController.getShoppingList(ctx);
    });
  }

  @Test
  public void getShoppingListItemWithoutId() throws IOException {

    Context ctx = mockContext("api/shoppingList/{id}", Map.of("id", "There once was a man from Nantucket"));
    assertThrows(BadRequestResponse.class, () -> {
      shoppingListController.getShoppingList(ctx);
    });
  }

  @Test
  public void deleteShoppingList() throws IOException {
    testID = new ObjectId();
    testID2 = new ObjectId();
    Document salad = new Document()
        .append("_id", testID)
        .append("name", "salad")
        .append("productID", testID2)
        .append("quantity", 3);
    shoppingListDocuments.insertOne(salad);
    String testid = testID.toHexString();

    // Product exists before deletion
    assertEquals(1, db.getCollection("shoppingList").countDocuments(eq("_id", testID)));

    Context ctx = mockContext("api/shoppingList/{id}", Map.of("id", testid));

    shoppingListController.deleteShoppingList(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());

    // Product is no longer in the database
    assertEquals(0, db.getCollection("shoppingList").countDocuments(eq("_id", testID)));
  }


  @Test
  public void addNullProductNameShoppingList() throws IOException {
    String id = new ObjectId().toHexString();
    String testNewShoppingList = "{"
        + "\"_id\": \"" + id + "\","
        + "\"name\": null,"
        + "\"quantity\": 69,"
        + "\"prodID\": 45432323"
        + "}";
    mockReq.setBodyContent(testNewShoppingList);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/shoppingList");

    assertThrows(ValidationException.class, () -> {
      shoppingListController.addNewShoppingList(ctx);
    });
  }

  @Test
  public void addEmptyProductNameShoppingList() throws IOException {
    String id = new ObjectId().toHexString();
    String testNewShoppingList = "{"
        + "\"_id\": \"" + id + "\","
        + "\"name\": \"\","
        + "\"quantity\": 69,"
        + "\"prodID\": 45432323"
        + "}";
    mockReq.setBodyContent(testNewShoppingList);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/shoppingList");

    assertThrows(ValidationException.class, () -> {
      shoppingListController.addNewShoppingList(ctx);
    });
  }

  @Test
  public void addInvalidQuantityProduct() throws IOException {
    String testNewProduct = "{"
        + "\"name\": \"chips\","
        + "\"quantity\": -96,"
        + "\"prodID\": 45432323"
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/shoppingList");

    assertThrows(ValidationException.class, () -> {
      shoppingListController.addNewShoppingList(ctx);
    });
  }

  @Test
  public void addShoppingList() throws IOException {

    String testNewShoppingList = "{"
        + "\"name\": \"chips\","
        + "\"quantity\": 69,"
        + "\"productID\": 45432323"
        + "}";
    mockReq.setBodyContent(testNewShoppingList);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/shoppingList");

    shoppingListController.addNewShoppingList(ctx);
    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    // Our status should be 201, i.e., our new shoppdeleteingList was successfully
    // created. This is a named constant in the class HttpURLConnection.
    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Successfully adding the shoppingList should return the newly generated
    // MongoDB ID
    // for that shoppingList.
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("shoppingList").countDocuments(eq("_id", new ObjectId(id))));

    // Verify that the shoppingList was added to the database with the correct ID
    Document addedShoppingList = db.getCollection("shoppingList").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedShoppingList);
    assertEquals("chips", addedShoppingList.getString("name"));
    assertEquals(69, addedShoppingList.getInteger("quantity"));
    assertEquals("45432323", addedShoppingList.getString("productID"));
  }
}
