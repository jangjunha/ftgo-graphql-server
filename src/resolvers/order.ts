import { status } from "@grpc/grpc-js";
import { GetTicketPayload } from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import { consumerService, restaurantService } from "./";
import { OrderResolvers } from "../generated/graphql";
import { convertConsumer, convertRestaurant, convertTicket } from "./utils";
import { kitchenService } from "../proxies/kitchen";

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

  async ticket({ id: orderId }) {
    const payload = new GetTicketPayload();
    payload.setTicketid(orderId);
    return new Promise((resolve) =>
      kitchenService.getTicket(payload, (err, value) => {
        if (err != null) {
          if (err.code == status.NOT_FOUND) {
            return null;
          }
          throw err;
        }
        if (value == null) {
          throw new Error(`Cannot find ticket ${orderId}`);
        }
        resolve(convertTicket(value));
      })
    );
  },
};
export default resolver;
