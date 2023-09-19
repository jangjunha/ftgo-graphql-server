import { AcceptTicketPayload } from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import {
  CreateOrderPayload,
  MenuItemIdAndQuantity,
} from "@jangjunha/ftgo-proto/lib/orders_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

import { accountingService, consumerService, restaurantService } from ".";
import {
  Account,
  Consumer,
  MutationResolvers,
  Order,
} from "../generated/graphql";
import { convertAccount, convertConsumer } from "./utils";
import { kitchenService } from "../proxies/kitchen";
import { convertOrder } from "./utils";
import { orderService } from "../proxies/order";

const resolver: MutationResolvers = {
  async createRestaurant(_, { r }): Promise<string> {
    const id = await restaurantService.createRestaurant(r);
    return id;
  },

  async createConsumer(_, { c: consumerInfo }): Promise<Consumer> {
    const data = await consumerService.createConsumer(consumerInfo.name);
    return convertConsumer(data);
  },

  async createOrder(
    _,
    { o: { consumerId, restaurantId, lineItems, deliveryAddress } }
  ): Promise<Order> {
    const payload = new CreateOrderPayload();
    payload.setConsumerid(consumerId);
    payload.setRestaurantid(restaurantId);
    payload.setItemsList(
      lineItems.map((li) => {
        const item = new MenuItemIdAndQuantity();
        item.setMenuitemid(li.menuItemId);
        item.setQuantity(li.quantity);
        return item;
      })
    );
    payload.setDeliveryaddress(deliveryAddress);
    return new Promise((resolve) => {
      orderService.createOrder(payload, (err, order) => {
        if (err != null) {
          console.error(err);
          throw err;
        }
        if (order == null) {
          throw new Error("Unexpected exception: order is null");
        }
        resolve(convertOrder(order));
      });
    });
  },

  async acceptTicket(_, { ticketId, readyBy }): Promise<string> {
    const payload = new AcceptTicketPayload();
    payload.setTicketid(ticketId);
    payload.setReadyby(Timestamp.fromDate(new Date(readyBy)));
    return new Promise((resolve) => {
      kitchenService.acceptTicket(payload, (err, _) => {
        if (err != null) {
          throw err;
        }
        resolve(ticketId);
      });
    });
  },

  async depositAccount(_, { accountId, amount }): Promise<Account> {
    const account = await accountingService.depositAccount(accountId, amount);
    return convertAccount(account);
  },

  async withdrawAccount(_, { accountId, amount }): Promise<Account> {
    const account = await accountingService.withdrawAccount(accountId, amount);
    return convertAccount(account);
  },
};
export default resolver;
