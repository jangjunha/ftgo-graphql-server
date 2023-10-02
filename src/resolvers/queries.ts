import { QueryResolvers } from "../generated/graphql";
import {
  convertConsumer,
  convertOrderHistory,
  convertRestaurant,
  convertTicket,
} from "./utils";

const queries: QueryResolvers = {
  async order(_, { id }, { orderHistoryService }) {
    const order = await orderHistoryService.findOrder(id);
    return convertOrderHistory(order);
  },

  async consumer(_, { id }, { consumerService }) {
    const consumer = await consumerService.findConsumer(id);
    return convertConsumer(consumer);
  },

  async restaurant(_, { id }, { restaurantService }) {
    const restaurant = await restaurantService.findRestaurant(id);
    return convertRestaurant(restaurant);
  },

  async restaurants(_, {}, { restaurantService }) {
    const restaurants = await restaurantService.listRestaurants();
    return restaurants.map(convertRestaurant);
  },

  async ticket(_, { id }, { kitchenService }) {
    const ticket = await kitchenService.getTicket(id);
    return convertTicket(ticket);
  },
};

export default queries;
