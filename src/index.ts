import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { auth, AuthResult } from "express-oauth2-jwt-bearer";
import http from "http";

import { resolver } from "./resolvers";
import { typeDefs } from "./schema";
import { KitchenService } from "./proxies/kitchen";
import { OrderService } from "./proxies/order";
import { OrderHistoryService } from "./proxies/order-history";
import { ConsumerService } from "./proxies/consumer";
import { RestaurantService } from "./proxies/restaurant";
import { AccountingService } from "./proxies/accounting";
import { DeliveryService } from "./proxies/delivery";

export interface AppContext {
  auth?: AuthResult;
  kitchenService: KitchenService;
  orderService: OrderService;
  orderHistoryService: OrderHistoryService;
  consumerService: ConsumerService;
  restaurantService: RestaurantService;
  accountingService: AccountingService;
  deliveryService: DeliveryService;
}

const jwtCheck = auth({
  audience: "https://api.ftgo.jangjunha.me",
  issuerBaseURL: "https://ftgo-jangjunha.jp.auth0.com/",
  tokenSigningAlg: "RS256",
  authRequired: false,
});

async function run() {
  const PORT = 4000;

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<AppContext>({
    typeDefs,
    resolvers: resolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    cors(),
    jwtCheck,
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        auth: req.auth,
        kitchenService: new KitchenService(
          process.env.KITCHEN_SERVICE_URL!,
          req.auth
        ),
        orderService: new OrderService(
          process.env.ORDER_SERVICE_URL!,
          req.auth
        ),
        orderHistoryService: new OrderHistoryService(
          process.env.ORDER_HISTORY_SERVICE_URL!,
          req.auth
        ),
        consumerService: new ConsumerService(
          process.env.CONSUMER_SERVICE_URL!,
          req.auth
        ),
        restaurantService: new RestaurantService(
          process.env.RESTAURANT_SERVICE_URL!,
          req.auth
        ),
        accountingService: new AccountingService(
          process.env.ACCOUNTING_SERVICE_URL!,
          req.auth
        ),
        deliveryService: new DeliveryService(
          process.env.DELIVERY_SERVICE_URL!,
          req.auth
        ),
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

run();
