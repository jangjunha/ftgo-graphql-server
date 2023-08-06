import { consumerService } from ".";
import {
  Consumer,
  MutationResolvers,
} from "../generated/graphql";
import { convertConsumer } from "./utils";

const resolver: MutationResolvers = {
  async createConsumer(_, { c: consumerInfo }): Promise<Consumer> {
    const data = await consumerService.createConsumer(consumerInfo.name);
    return convertConsumer(data);
  },
};
export default resolver;
