import { GetTicketPayload } from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import { consumerService, orderHistoryService, restaurantService } from "./";
import { QueryResolvers } from "../generated/graphql";
import {
  convertConsumer,
  convertOrderHistory,
  convertRestaurant,
  convertTicket,
} from "./utils";
import { kitchenService } from "../proxies/kitchen";

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

  async ticket(_, { id }) {
    const payload = new GetTicketPayload();
    payload.setTicketid(id);
    return new Promise((resolve) =>
      kitchenService.getTicket(payload, (err, value) => {
        if (err != null) {
          throw err;
        }
        if (value == null) {
          throw new Error(`Cannot find ticket ${id}`);
        }
        resolve(convertTicket(value));
      })
    );
  },
};

export default queries;
