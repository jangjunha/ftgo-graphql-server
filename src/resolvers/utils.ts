import {
  Consumer,
  DeliveryStatus,
  Order,
  Restaurant,
} from "../generated/graphql";
import { Consumer as ConsumerInput } from "../proxies/consumer";
import { Order as OrderHistoryInput } from "../proxies/order-history";
import { Restaurant as RestaurantInput } from "../proxies/restaurant";

const emptyConsumer = (id: string): Consumer => ({
  id,
  name: "",
  orders: [],
});

export const convertConsumer = (input: ConsumerInput): Consumer => ({
  orders: [],
  ...input,
});

export const convertOrderHistory = (input: OrderHistoryInput): Order => ({
  id: input.orderId,
  restaurant: {
    id: input.restaurantId,
    name: input.restaurantName,
    menuItems: [],
  },
  consumer: emptyConsumer(input.consumerId),
  deliveryInfo: { status: DeliveryStatus.Preparing }, // TODO:
  ...input,
});

export const convertRestaurant = (input: RestaurantInput): Restaurant => ({
  ...input,
});
