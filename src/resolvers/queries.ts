import { QueryResolvers } from "../generated/graphql";

const queries: QueryResolvers = {
  hello(): string {
    return "hello";
  },
};

export default queries;
