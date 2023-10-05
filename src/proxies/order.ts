import { CallCredentials, ChannelCredentials } from "@grpc/grpc-js";
import {
  CreateOrderPayload,
  MenuItemIdAndQuantity as MenuItemIdAndQuantityPb,
  Order,
} from "@jangjunha/ftgo-proto/lib/orders_pb";
import { OrderServiceClient } from "@jangjunha/ftgo-proto/lib/orders_grpc_pb";
import { AuthResult } from "express-oauth2-jwt-bearer";

import { generateGrpcCredentials } from "../auth";
import { MenuItemIdAndQuantity } from "../generated/graphql";

export class OrderService {
  stub: OrderServiceClient;
  credentials: CallCredentials;

  constructor(url: string, auth?: AuthResult) {
    this.stub = new OrderServiceClient(
      url,
      ChannelCredentials.createInsecure()
    );
    this.credentials = generateGrpcCredentials(auth);
  }

  async createOrder(
    consumerId: string,
    restaurantId: string,
    lineItems: MenuItemIdAndQuantity[],
    deliveryAddress: string
  ): Promise<Order> {
    const payload = new CreateOrderPayload();
    payload.setConsumerid(consumerId);
    payload.setRestaurantid(restaurantId);
    payload.setItemsList(
      lineItems.map((li) => {
        const item = new MenuItemIdAndQuantityPb();
        item.setMenuitemid(li.menuItemId);
        item.setQuantity(li.quantity);
        return item;
      })
    );
    payload.setDeliveryaddress(deliveryAddress);
    return new Promise((resolve) => {
      this.stub.createOrder(
        payload,
        { credentials: this.credentials },
        (err, order) => {
          if (err != null) {
            console.error(err);
            throw err;
          }
          if (order == null) {
            throw new Error("Unexpected exception: order is null");
          }
          resolve(order);
        }
      );
    });
  }
}
