import { ConsumerResolvers } from "../generated/graphql.js";

import { orderHistoryService } from "./";
import { convertOrderHistory } from "./utils";

const resolver: ConsumerResolvers = {
  async orders(consumer) {
    const res = await orderHistoryService.findOrdersByConsumerId(consumer.id);
    return res.orders.map(convertOrderHistory);
  },
};
export default resolver;
