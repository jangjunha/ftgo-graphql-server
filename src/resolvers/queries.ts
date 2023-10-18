import { GraphQLError } from "graphql";
import { QueryResolvers } from "../generated/graphql";
import {
  convertConsumer,
  convertCourier,
  convertDelivery,
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
    if (ticket == null) {
      throw new GraphQLError(`Cannot find ticket ${id}`);
    }
    return convertTicket(ticket);
  },

  async delivery(_, { id }, { deliveryService }) {
    const delivery = await deliveryService.getDelivery(id);
    return convertDelivery(delivery);
  },

  async courier(_, { id }, { deliveryService }) {
    const courier = await deliveryService.getCourier(id);
    return convertCourier(courier);
  },
};

export default queries;
