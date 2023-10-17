import {
  Account,
  Consumer,
  Courier,
  MutationResolvers,
  Order,
  Ticket,
} from "../generated/graphql";
import { auth } from "../proxies/auth";
import {
  convertAccount,
  convertConsumer,
  convertCourier,
  convertTicket,
} from "./utils";
import { convertOrder } from "./utils";

const resolver: MutationResolvers = {
  async createRestaurant(_, { r }, { restaurantService }): Promise<string> {
    const id = await restaurantService.createRestaurant({
      name: r.name,
      menuItems: r.menuItems,
    });
    await auth.users.create({
      email: r.manager.email,
      password: r.manager.password,
      app_metadata: {
        "auth/restaurant-id": id,
      },
      connection: "Username-Password-Authentication",
    });
    return id;
  },

  async createConsumer(
    _,
    { c: input },
    { consumerService }
  ): Promise<Consumer> {
    const data = await consumerService.createConsumer(input.email);
    await auth.users.create({
      email: input.email,
      password: input.password,
      app_metadata: {
        "auth/consumer-id": data.id,
      },
      connection: "Username-Password-Authentication",
    });
    return convertConsumer(data);
  },

  async createOrder(
    _,
    { o: { consumerId, restaurantId, lineItems, deliveryAddress } },
    { orderService }
  ): Promise<Order> {
    const order = await orderService.createOrder(
      consumerId,
      restaurantId,
      lineItems,
      deliveryAddress
    );
    return convertOrder(order);
  },

  async acceptTicket(
    _,
    { ticketId, readyBy },
    { kitchenService }
  ): Promise<string> {
    return kitchenService.acceptTicket(ticketId, readyBy);
  },

  async preparingTicket(_, { ticketId }, { kitchenService }): Promise<Ticket> {
    const ticket = await kitchenService.preparingTicket(ticketId);
    return convertTicket(ticket);
  },

  async readyForPickupTicket(
    _,
    { ticketId },
    { kitchenService }
  ): Promise<Ticket> {
    const ticket = await kitchenService.readyForPickupTicket(ticketId);
    return convertTicket(ticket);
  },

  async depositAccount(
    _,
    { accountId, amount },
    { accountingService }
  ): Promise<Account> {
    const account = await accountingService.depositAccount(accountId, amount);
    return convertAccount(account);
  },

  async withdrawAccount(
    _,
    { accountId, amount },
    { accountingService }
  ): Promise<Account> {
    const account = await accountingService.withdrawAccount(accountId, amount);
    return convertAccount(account);
  },

  async pickupDelivery(_, { id }, { deliveryService }): Promise<string> {
    await deliveryService.pickupDelivery(id);
    return id;
  },

  async dropoffDelivery(_, { id }, { deliveryService }): Promise<string> {
    await deliveryService.dropoffDelivery(id);
    return id;
  },

  async createCourier(_, { c: input }, { deliveryService }): Promise<string> {
    const courier = await deliveryService.createCourier();
    const id = courier.getId();
    await auth.users.create({
      email: input.email,
      password: input.password,
      app_metadata: {
        "auth/courier-id": id,
      },
      connection: "Username-Password-Authentication",
    });
    return id;
  },

  async updateCourierAvailability(
    _,
    { id, available },
    { deliveryService }
  ): Promise<Courier> {
    await deliveryService.updateCourierAvailability(id, available);
    const courier = await deliveryService.getCourier(id);
    return convertCourier(courier);
  },
};
export default resolver;
