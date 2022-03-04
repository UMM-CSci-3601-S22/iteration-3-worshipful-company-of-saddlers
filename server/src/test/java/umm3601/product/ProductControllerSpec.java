package umm3601.product;

import static com.mongodb.client.model.Filters.eq;
import static io.javalin.plugin.json.JsonMapperKt.JSON_MAPPER_KEY;
import static java.util.Map.entry;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

/**
 * Tests the logic of the ProductController
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
@SuppressWarnings({ "MagicNumber" })
public class ProductControllerSpec {

  // Mock requests and responses that will be reset in `setupEach()`
  // and then (re)used in each of the tests.
  private MockHttpServletRequest mockReq = new MockHttpServletRequest();
  private MockHttpServletResponse mockRes = new MockHttpServletResponse();

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ProductController productController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId milksId;

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

    // Setup database
    MongoCollection<Document> productDocuments = db.getCollection("products");
    productDocuments.drop();
    List<Document> testProducts = new ArrayList<>();
    testProducts.add(
        new Document()
            .append("product_name", "Banana")
            .append("description", "A yellow fruit")
            .append("brand", "Dole")
            .append("category", "produce")
            .append("store", "Willies")
            .append("location", "They're In A Wall")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new String[] {"yellow fruit", "potassium"})
            .append("threshold", 40));
    testProducts.add(
        new Document()
            .append("product_name", "Canned Pinto Beans")
            .append("description", "A can of pinto beans")
            .append("brand", "Our Family")
            .append("category", "canned goods")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 2000)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new String[] {"canned food", "non-perishable", "beans"})
            .append("threshold", 4));
    testProducts.add(
        new Document()
            .append("product_name", "Bread")
            .append("description", "You know what this is.")
            .append("brand", "Richard's Castle")
            .append("category", "bakery")
            .append("store", "Willies")
            .append("location", "They're In the Walls")
            .append("lifespan", 14)
            .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
            .append("notes", "I eat these with toothpaste, yum-yum.")
            .append("tags", new String[] {"Yeast", "contains gluten", "toast"})
            .append("threshold", 3));
    testProducts.add(
        new Document()
            .append("product_name", "Rock")
            .append("description", "")
            .append("brand", "Hurt Ball")
            .append("category", "miscellaneous")
            .append("store", "Willies")
            .append("location", "")
            .append("lifespan", "")
            .append("image", "")
            .append("notes", "")
            .append("tags", new String[] {})
            .append("threshold", ""));

    milksId = new ObjectId();
    Document milk = new Document()
        .append("product_name", "Milk")
        .append("description", "A dairy liquid obtained from the teat of an unsuspecting animal")
        .append("brand", "Gerbil Goods")
        .append("category", "Dairy")
        .append("store", "Co-op")
        .append("location", "They're In the Walls")
        .append("lifespan", 14)
        .append("image", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon")
        .append("notes", "check on gerbils every 3 days")
        .append("tags", new String[] {"dairy", "perishable", "cold storage"})
        .append("threshold", 2);

    productDocuments.insertMany(testProducts);
    productDocuments.insertOne(milk);

    productController = new ProductController(db);
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
  private Product[] returnedProducts(Context ctx) {
    String result = ctx.resultString();
    Product[] products = javalinJackson.fromJsonString(result, Product[].class);
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
  private Product returnedSingleProduct(Context ctx) {
    String result = ctx.resultString();
    Product product = javalinJackson.fromJsonString(result, Product.class);
    return product;
  }

  @Test
  public void canGetAllProducts() throws IOException {
    // Create our fake Javalin context
    String path = "api/products";
    Context ctx = mockContext(path);

    productController.getProducts(ctx);
    Product[] returnedProducts = returnedProducts(ctx);

    // The response status should be 200, i.e., our request.append("_id", milksId)
    // was handled successfully (was OK). This is a named constant in
    // the class HttpCode.
    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(
        db.getCollection("products").countDocuments(),
        returnedProducts.length);
  }

  @Test
  public void canGetProductsByBrand() throws IOException {
    mockReq.setQueryString("Brand=Dole");
    Context ctx = mockContext("api/products");

    productController.getProducts(ctx);
    Product[] resultProducts = returnedProducts(ctx);

    assertEquals(HttpCode.OK.getStatus(), mockRes.getStatus());
    assertEquals(1, resultProducts.length); // There should be one product returned
    for (Product product : resultProducts) {
      assertEquals("Dole", product.brand);
    }
  }

  @Test
  public void getProductsByStore() throws IOException {
    mockReq.setQueryString("store=Willies");
    Context ctx = mockContext("api/products");

    productController.getProducts(ctx);
    Product[] resultProducts = returnedProducts(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    assertEquals(3, resultProducts.length);
    for (Product product : resultProducts) {
      assertEquals("Willies", product.store);
    }
  }

  @Test
  public void getProductsByCategory() throws IOException {
    mockReq.setQueryString("category=dairy");
    Context ctx = mockContext("api/products");

    productController.getProducts(ctx);
    Product[] resultProducts = returnedProducts(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    assertEquals(3, resultProducts.length);
    for (Product product : resultProducts) {
      assertEquals("Willies", product.store);
    }
  }

  @Test
  public void getProductWithExistentId() throws IOException {
    String testID = milksId.toHexString();
    Context ctx = mockContext("api/products/{id}", Map.of("id", testID));

    productController.getProduct(ctx);
    Product resultProduct = returnedSingleProduct(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());
    assertEquals(milksId.toHexString(), resultProduct._id);
    assertEquals("Milk", resultProduct.product_name);
  }

  @Test
  public void getProductWithBadId() throws IOException {
    Context ctx = mockContext("api/products/{id}", Map.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      productController.getProduct(ctx);
    });
  }

  @Test
  public void getProductWithNonexistentId() throws IOException {
    Context ctx = mockContext("api/products/{id}", Map.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      productController.getProduct(ctx);
    });
  }

  @Test
  public void addProduct() throws IOException {

    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    productController.addNewProduct(ctx);
    String result = ctx.resultString();
    String id = javalinJackson.fromJsonString(result, ObjectNode.class).get("id").asText();

    // Our status should be 201, i.e., our new product was successfully
    // created. This is a named constant in the class HttpURLConnection.
    assertEquals(HttpURLConnection.HTTP_CREATED, mockRes.getStatus());

    // Successfully adding the product should return the newly generated MongoDB ID
    // for that product.
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("products").countDocuments(eq("_id", new ObjectId(id))));

    // Verify that the product was added to the database with the correct ID
    Document addedProduct = db.getCollection("products").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedProduct);
    assertEquals("Test Product name", addedProduct.getString("product_name"));
    assertEquals("A test product description", addedProduct.getString("description"));
    assertEquals("test brand", addedProduct.getString("brand"));
    assertEquals("test category", addedProduct.getString("category"));
    assertEquals("test store", addedProduct.getString("store"));
    assertEquals("test location", addedProduct.getString("location"));
    assertEquals("test tag", addedProduct.getString("tags"));
    assertEquals("tastes like test", addedProduct.getString("notes"));
    assertEquals(100, addedProduct.getInteger("lifespan"));
    assertEquals(84, addedProduct.getInteger("threshold"));
    assertTrue(addedProduct.containsKey("image"));
  }

  @Test
  public void addInvalidCategoryProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": not a valid lifespan"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addInvalidThresholdProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": not a valid threshold"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addEmptyLifespanProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": null"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    // assertNotNull(addedProduct); // is this what name you want for the not yet
    // written method?
    // assertNull(addedProduct.getInteger("lifespan"));
  }

  @Test
  public void addNullNameProduct() throws IOException {
    String testNewProduct = "{"
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullBrandProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        // + "\"brand\": \"test brand\","//
        + "\"category\": \"test category\","
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullCategoryProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        // + "\"category\": \"test category\","//
        + "\"store\": \"test store\","
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void addNullStoreProduct() throws IOException {
    String testNewProduct = "{"
        + "\"product_name\": \"Test Product name\","
        + "\"description\":\"A test product description\","
        + "\"brand\": \"test brand\","
        + "\"category\": \"test category\","
        // + "\"store\": \"test store\","//
        + "\"location\": \"test location\","
        + "\"notes\": \"tastes like test\","
        + "\"tags\": \"test tag\""
        + "\"lifespan\": 100"
        + "\"threshold\": 84"
        + "\"image\": \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\""
        + "}";
    mockReq.setBodyContent(testNewProduct);
    mockReq.setMethod("POST");

    Context ctx = mockContext("api/products");

    assertThrows(ValidationException.class, () -> {
      productController.addNewProduct(ctx);
    });
  }

  @Test
  public void deleteProduct() throws IOException {
    String testID = milksId.toHexString();

    // Product exists before deletion
    assertEquals(1, db.getCollection("products").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = mockContext("api/products/{id}", Map.of("id", testID));

    productController.deleteProduct(ctx);

    assertEquals(HttpURLConnection.HTTP_OK, mockRes.getStatus());

    // Product is no longer in the database
    assertEquals(0, db.getCollection("products").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
