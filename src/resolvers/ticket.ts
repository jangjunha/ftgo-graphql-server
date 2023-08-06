import { TicketResolvers } from "../generated/graphql";

import { restaurantService } from "./";
import { convertRestaurant } from "./utils";

const resolver: TicketResolvers = {
  async restaurant({ restaurant: r }) {
    const restaurant = await restaurantService.findRestaurant(r.id);
    return convertRestaurant(restaurant);
  },
};
export default resolver;
