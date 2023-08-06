import { consumerService, restaurantService } from "./";
import { QueryResolvers } from "../generated/graphql";
import { convertConsumer, convertRestaurant } from "./utils";

const queries: QueryResolvers = {
  async consumer(_, { id }) {
    const consumer = await consumerService.findConsumer(id);
    return convertConsumer(consumer);
  },

  async restaurant(_, { id }) {
    const restaurant = await restaurantService.findRestaurant(id);
    return convertRestaurant(restaurant);
  },
};

export default queries;
