import { AcceptTicketPayload } from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

import { accountingService, consumerService } from ".";
import {
  Account,
  Consumer,
  MutationResolvers,
  Order,
} from "../generated/graphql";
import { convertAccount, convertConsumer } from "./utils";
import { kitchenService } from "../proxies/kitchen";

const resolver: MutationResolvers = {
  async createConsumer(_, { c: consumerInfo }): Promise<Consumer> {
    const data = await consumerService.createConsumer(consumerInfo.name);
    return convertConsumer(data);
  },

  async acceptTicket(_, { ticketId, readyBy }): Promise<string> {
    const payload = new AcceptTicketPayload();
    payload.setTicketid(ticketId);
    payload.setReadyby(Timestamp.fromDate(new Date(readyBy)));
    return new Promise((resolve) => {
      kitchenService.acceptTicket(payload, (err, _) => {
        if (err != null) {
          throw err;
        }
        resolve(ticketId);
      });
    });
  },

  async depositAccount(_, { accountId, amount }): Promise<Account> {
    const account = await accountingService.depositAccount(accountId, amount);
    return convertAccount(account);
  },

  async withdrawAccount(_, { accountId, amount }): Promise<Account> {
    const account = await accountingService.withdrawAccount(accountId, amount);
    return convertAccount(account);
  },
};
export default resolver;
