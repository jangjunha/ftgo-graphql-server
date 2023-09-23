import { TicketResolvers } from "../generated/graphql";

import { convertRestaurant } from "./utils";

const resolver: TicketResolvers = {
  async restaurant({ restaurant: r }, _, { restaurantService }) {
    const restaurant = await restaurantService.findRestaurant(r.id);
    return convertRestaurant(restaurant);
  },
};
export default resolver;
