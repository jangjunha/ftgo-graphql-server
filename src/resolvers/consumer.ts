import { ConsumerResolvers } from "../generated/graphql.js";

import { convertAccountDetails, convertOrderHistory } from "./utils";

const resolver: ConsumerResolvers = {
  async account({ account: a }, _, { accountingService }) {
    const account = await accountingService.findAccount(a.id);
    return convertAccountDetails(account);
  },

  async orders(consumer, _, { orderHistoryService }) {
    const res = await orderHistoryService.findOrdersByConsumerId(consumer.id);
    return res.orders.map(convertOrderHistory);
  },
};
export default resolver;
