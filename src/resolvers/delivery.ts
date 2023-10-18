import { DeliveryResolvers } from "../generated/graphql.js";
import { convertCourier, convertTicket } from "./utils.js";

const resolver: DeliveryResolvers = {
  async assignedCourier(delivery, {}, { deliveryService }) {
    if (delivery.assignedCourier == null) {
      return null;
    }
    const courier = await deliveryService.getCourier(
      delivery.assignedCourier.id
    );
    return convertCourier(courier);
  },

  async ticket(delivery, {}, { kitchenService }) {
    const ticket = await kitchenService.getTicket(delivery.id);
    if (ticket == null) {
      throw new Error(`Cannot find ticket for delivery ${delivery.id}`);
    }
    return convertTicket(ticket);
  },
};
export default resolver;
