import { DeliveryResolvers } from "../generated/graphql.js";
import { convertCourier } from "./utils.js";

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
};
export default resolver;
