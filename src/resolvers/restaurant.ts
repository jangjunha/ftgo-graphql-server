import { RestaurantResolvers } from "../generated/graphql";
import { convertTicketEdge } from "./utils";

const resolver: RestaurantResolvers = {
  async tickets({ id }, { after, first, before, last }, { kitchenService }) {
    const result = await kitchenService.listTicket(
      id,
      after ?? null,
      first ?? null,
      before ?? null,
      last ?? null
    );
    return {
      edges: result.map(convertTicketEdge),
    };
  },
};
export default resolver;
