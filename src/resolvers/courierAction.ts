import { CourierActionResolvers } from "../generated/graphql.js";
import { convertDelivery } from "./utils.js";

const resolver: CourierActionResolvers = {
  async delivery(action, {}, { deliveryService }) {
    const plan = await deliveryService.getDelivery(action.delivery.id);
    return convertDelivery(plan);
  },
};
export default resolver;
