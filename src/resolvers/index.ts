import { Resolvers } from "../generated/graphql";
import { OrderHistoryService } from "../proxies/order-history";
import { ConsumerService } from "../proxies/consumer";
import { RestaurantService } from "../proxies/restaurant";
import Query from "./queries";
import Consumer from "./consumer";
import Order from "./order";

export const orderHistoryService = new OrderHistoryService(
  process.env.ORDER_HISTORY_SERVICE_URL!
);

export const consumerService = new ConsumerService(
  process.env.CONSUMER_SERVICE_URL!
);

export const restaurantService = new RestaurantService(
  process.env.RESTAURANT_SERVICE_URL!
);

export const resolver: Resolvers = {
  Query,
  Consumer,
  Order,
};
