import { consumerService } from "./";
import { QueryResolvers } from "../generated/graphql";
import { convertConsumer } from "./utils";

const queries: QueryResolvers = {
  async consumer(_, { id }) {
    const consumer = await consumerService.findConsumer(id);
    return convertConsumer(consumer);
  },
};

export default queries;
