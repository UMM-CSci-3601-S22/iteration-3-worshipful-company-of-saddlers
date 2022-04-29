package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.bson.UuidRepresentation;

import io.javalin.Javalin;
import io.javalin.core.util.RouteOverviewPlugin;
import io.javalin.http.InternalServerErrorResponse;
import umm3601.pantry.PantryController;
import umm3601.product.ProductController;
import umm3601.shoppingList.ShoppingListController;

public class Server {

  private static final int SERVER_PORT = 4567;

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(MongoClientSettings
        .builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        // Old versions of the mongodb-driver-sync package encoded UUID values
        // (universally unique identifiers) in
        // a non-standard way. This option says to use the standard encoding.
        // See:
        // https://studio3t.com/knowledge-base/articles/mongodb-best-practices-uuid-data/
        .uuidRepresentation(UuidRepresentation.STANDARD)
        .build());

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    ProductController productController = new ProductController(database);
    ShoppingListController shoppingListController = new ShoppingListController(database);
    PantryController pantryController = new PantryController(database);

    Javalin server = Javalin.create(config -> config.registerPlugin(new RouteOverviewPlugin("/api")));
    /*
     * We want to shut the `mongoClient` down if the server either
     * fails to start, or when it's shutting down for whatever reason.
     * Since the mongClient needs to be available throughout the
     * life of the server, the only way to do this is to wait for
     * these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
    });
    Runtime.getRuntime().addShutdownHook(new Thread(server::stop));

    server.start(SERVER_PORT);

    // List products, filtered using query params
    server.get("/api/products", productController::getAllProducts);

    // Change product, should change product info to the new info given by ctx
    server.put("/api/products", productController::changeProduct);

    // Get the specified product
    server.get("/api/products/{id}", productController::getProductByID);

    // List products, filtered using query params
    server.get("/api/pantry", pantryController::getAllItems);

    // List products, filtered using query params
    server.get("/api/pantry/info", pantryController::getPantryInfo);

    // Get the specified pantry item
    server.get("/api/pantry/{id}", pantryController::getPantryItemByID);

    // Delete the specified product
    server.delete("/api/products/{id}", productController::deleteProduct);

    // Delete the specified pantry item
    server.delete("/api/pantry/{id}", pantryController::deletePantryItem);

    server.delete("/api/shoppingList/{id}", shoppingListController::deleteShoppingList);

    // Add new product with info from JSON body of HTTP request
    server.post("/api/products", productController::addNewProduct);

    // Add new pantry item with info from JSON body of HTTP request
    server.post("/api/pantry", pantryController::addNewPantryItem);

    server.get("/api/shoppingList", shoppingListController::getShoppingLists);

    server.get("/api/generateTest", shoppingListController::generateShoppingList);

    server.get("/api/shoppingList/{id}", shoppingListController::getShoppingList);
    // Add new item to the shopping list
    server.post("/api/shoppingList", shoppingListController::addNewShoppingList);
    // This catches any uncaught exceptions thrown in the server
    // code and turns them into a 500 response ("Internal Server
    // Error Response"). In general you'll like to *never* actually
    // return this, as it's an instance of the server crashing in
    // some way, and returning a 500 to your user is *super*
    // unhelpful to them. In a production system you'd almost
    // certainly want to use a logging library to log all errors
    // caught here so you'd know about them and could try to address
    // them.
    server.exception(Exception.class, (e, ctx) -> {
    throw new InternalServerErrorResponse(e.toString());
    });
  }
}
