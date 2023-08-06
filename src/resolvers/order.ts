import { consumerService, restaurantService } from "./";
import { OrderResolvers } from "../generated/graphql";
import { convertConsumer, convertRestaurant } from "./utils";

const resolver: OrderResolvers = {
  async restaurant({ restaurant: r }) {
    if (r == null) {
      throw Error("Cannot find restaurant id");
    }
    const restaurant = await restaurantService.findRestaurant(r.id);
    return convertRestaurant(restaurant);
  },

  async consumer({ consumer: c }) {
    if (c == null) {
      throw Error("Cannot find consumer id");
    }
    const consumer = await consumerService.findConsumer(c.id);
    return convertConsumer(consumer);
  },
};
export default resolver;
