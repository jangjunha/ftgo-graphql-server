import { OrderResolvers } from "../generated/graphql";
import { convertConsumer, convertRestaurant, convertTicket } from "./utils";

const resolver: OrderResolvers = {
  async restaurant({ restaurant: r }, _, { restaurantService }) {
    if (r == null) {
      throw Error("Cannot find restaurant id");
    }
    const restaurant = await restaurantService.findRestaurant(r.id);
    return convertRestaurant(restaurant);
  },

  async consumer({ consumer: c }, _, { consumerService }) {
    if (c == null) {
      throw Error("Cannot find consumer id");
    }
    const consumer = await consumerService.findConsumer(c.id);
    return convertConsumer(consumer);
  },

  async ticket({ id: orderId }, _, { kitchenService }) {
    const ticket = await kitchenService.getTicket(orderId);
    return ticket ? convertTicket(ticket) : null;
  },
};
export default resolver;
