import { accountingService, consumerService } from ".";
import {
  Account,
  Consumer,
  MutationResolvers,
} from "../generated/graphql";
import { convertAccount, convertConsumer } from "./utils";

const resolver: MutationResolvers = {
  async createConsumer(_, { c: consumerInfo }): Promise<Consumer> {
    const data = await consumerService.createConsumer(consumerInfo.name);
    return convertConsumer(data);
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
