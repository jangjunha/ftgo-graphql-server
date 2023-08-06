import {
  Account,
  Consumer,
  DeliveryStatus,
  Money,
  Order,
  Restaurant,
} from "../generated/graphql";
import { AccountDetails as AccountInput } from "../proxies/accounting";
import { Consumer as ConsumerInput } from "../proxies/consumer";
import { Order as OrderHistoryInput } from "../proxies/order-history";
import { Restaurant as RestaurantInput } from "../proxies/restaurant";

const emptyAccount = (id: string): Account => ({ id, balance: { amount: "" } });
const emptyConsumer = (id: string): Consumer => ({
  id,
  name: "",
  account: emptyAccount(id),
  orders: [],
});

export const convertConsumer = (input: ConsumerInput): Consumer => ({
  orders: [],
  account: emptyAccount(input.id),
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

export const convertAccount = (input: AccountInput): Account => ({
  id: input.id,
  balance: convertMoney(input.amount),
});

const convertMoney = (input: MoneyInput): Money => ({
  amount: input.amount,
});
