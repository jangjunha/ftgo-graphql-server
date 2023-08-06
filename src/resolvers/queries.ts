import { consumerService, orderHistoryService, restaurantService } from "./";
import { QueryResolvers } from "../generated/graphql";
import {
  convertConsumer,
  convertOrderHistory,
  convertRestaurant,
} from "./utils";

const queries: QueryResolvers = {
  async order(_, { id }, context) {
    const order = await orderHistoryService.findOrder(id);
    return convertOrderHistory(order);
  },

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
