import { Consumer, Restaurant } from "../generated/graphql";
import { Consumer as ConsumerInput } from "../proxies/consumer";
import { Restaurant as RestaurantInput } from "../proxies/restaurant";

export const convertConsumer = (input: ConsumerInput): Consumer => ({
  ...input,
});

export const convertRestaurant = (input: RestaurantInput): Restaurant => ({
  ...input,
});
