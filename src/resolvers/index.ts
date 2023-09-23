import { resolvers as scalarResolvers } from "graphql-scalars";
import { Resolvers } from "../generated/graphql";
import Query from "./queries";
import Mutation from "./mutations";
import Consumer from "./consumer";
import Order from "./order";
import Ticket from "./ticket";

export const resolver: Resolvers = {
  ...scalarResolvers,
  Query,
  Mutation,
  Consumer,
  Order,
  Ticket,
};
