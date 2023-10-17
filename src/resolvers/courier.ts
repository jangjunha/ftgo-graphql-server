import { CourierResolvers } from "../generated/graphql.js";
import { convertCourierPlan } from "./utils.js";

const resolver: CourierResolvers = {
  async plan(courier, {}, { deliveryService }) {
    const plan = await deliveryService.getCourierPlan(courier.id);
    return convertCourierPlan(plan);
  },
};
export default resolver;
