import { Resolvers } from "../generated/graphql";
import { ConsumerService } from "../proxies/consumer";
import { RestaurantService } from "../proxies/restaurant";
import Query from "./queries";

export const consumerService = new ConsumerService(
  process.env.CONSUMER_SERVICE_URL!
);

export const restaurantService = new RestaurantService(
  process.env.RESTAURANT_SERVICE_URL!
);

export const resolver: Resolvers = {
  Query,
};
