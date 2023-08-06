import { ConsumerResolvers } from "../generated/graphql.js";

import { accountingService, orderHistoryService } from "./";
import { convertAccountDetails, convertOrderHistory } from "./utils";

const resolver: ConsumerResolvers = {
  async account({ account: a }) {
    const account = await accountingService.findAccount(a.id);
    return convertAccountDetails(account);
  },

  async orders(consumer) {
    const res = await orderHistoryService.findOrdersByConsumerId(consumer.id);
    return res.orders.map(convertOrderHistory);
  },
};
export default resolver;
