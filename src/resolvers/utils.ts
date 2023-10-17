import {
  Account,
  Consumer,
  Courier,
  CourierAction,
  CourierPlan,
  Delivery,
  DeliveryAction,
  DeliveryState,
  DeliveryStatus,
  Money,
  Order,
  OrderState,
  Restaurant,
  Ticket,
  TicketEdge,
  TicketLineItem,
  TicketState,
} from "../generated/graphql";
import {
  AccountDetails as AccountDetailsInput,
  Account as AccountInput,
} from "../proxies/accounting";
import { Consumer as ConsumerInput } from "../proxies/consumer";
import {
  Order as OrderHistoryInput,
  OrderState as OrderHistoryState,
} from "../proxies/order-history";
import { Restaurant as RestaurantInput } from "../proxies/restaurant";
import { Money as MoneyInput } from "../proxies/money";
import {
  TicketEdge as TicketEdgeInput,
  Ticket as TicketInput,
  TicketLineItem as TicketLineItemInput,
  TicketStateMap,
} from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import {
  Order as OrderInput,
  OrderStateMap,
} from "@jangjunha/ftgo-proto/lib/orders_pb";
import {
  Courier as CourierInput,
  CourierAction as CourierActionInput,
  CourierPlan as CourierPlanInput,
  DeliveryActionTypeMap,
  DeliveryStatus as DeliveryInput,
  DeliveryStateMap,
} from "@jangjunha/ftgo-proto/lib/deliveries_pb";
import { Money as MoneyPb } from "@jangjunha/ftgo-proto/lib/money_pb";

const emptyAccount = (id: string): Account => ({ id, balance: { amount: "" } });
const emptyConsumer = (id: string): Consumer => ({
  id,
  name: "",
  account: emptyAccount(id),
  orders: [],
});
const emptyRestaurant = (id: string): Restaurant => ({
  id,
  name: "",
  menuItems: [],
  tickets: { edges: [] },
});
const emptyTicket = (id: string): Ticket => ({
  id,
  state: TicketState.CreatePending,
  lineItems: [],
  restaurant: emptyRestaurant(""),
});
const emptyDelivery = (id: string): Delivery => ({
  id,
  state: DeliveryState.Pending,
  courierActions: [],
  ticket: emptyTicket(id),
});
const emptyCourier = (id: string): Courier => ({
  id,
  available: false,
  plan: emptyCourierPlan(),
});
const emptyCourierPlan = (): CourierPlan => ({
  actions: [],
});

export const convertConsumer = (input: ConsumerInput): Consumer => ({
  orders: [],
  account: emptyAccount(input.id),
  ...input,
});

export const convertOrder = (input: OrderInput): Order => ({
  id: input.getId(),
  state: convertOrderState(input.getState()),
  lineItems: input.getLineitemsList().map((li) => ({
    quantity: li.getQuantity(),
    menuItemId: li.getMenuitemid(),
    name: li.getName(),
    price: convertMoneyPb(li.getPrice()!),
  })),
  restaurant: emptyRestaurant(input.getRestaurantid()),
  consumer: emptyConsumer(input.getConsumerid()),
  deliveryInfo: { status: DeliveryStatus.Preparing }, // TODO:
});

export const convertOrderHistory = (input: OrderHistoryInput): Order => ({
  id: input.orderId,
  state: convertOrderHistoryState(input.status),
  restaurant: {
    id: input.restaurantId,
    name: input.restaurantName,
    menuItems: [],
    tickets: { edges: [] },
  },
  consumer: emptyConsumer(input.consumerId),
  deliveryInfo: { status: DeliveryStatus.Preparing }, // TODO:
  ...input,
});

export const convertRestaurant = (input: RestaurantInput): Restaurant => ({
  tickets: { edges: [] },
  ...input,
});

export const convertAccount = (input: AccountInput): Account => ({
  id: input.id,
  balance: convertMoney(input.balance),
});

export const convertAccountDetails = (input: AccountDetailsInput): Account => ({
  id: input.id,
  balance: convertMoney(input.amount),
});

export const convertTicket = (input: TicketInput): Ticket => ({
  id: input.getId(),
  state: convertTicketState(input.getState()),
  sequence: input.getSequence(),
  lineItems: input.getLineitemsList().map(convertTicketLineItem),
  restaurant: emptyRestaurant(input.getRestaurantid()),
  readyBy: input.getReadyby()?.toDate().toISOString(),
  acceptTime: input.getAccepttime()?.toDate().toISOString(),
  preparingTime: input.getPreparingtime()?.toDate().toISOString(),
  pickedUpTime: input.getPickeduptime()?.toDate().toISOString(),
  readyForPickupTime: input.getReadyby()?.toDate().toISOString(),
});

export const convertTicketEdge = (input: TicketEdgeInput): TicketEdge => ({
  node: convertTicket(input.getNode()!),
  cursor: input.getCursor(),
});

const convertOrderHistoryState = (input: OrderHistoryState): OrderState => {
  switch (input) {
    case "APPROVAL_PENDING":
      return OrderState.ApprovalPending;
    case "APPROVED":
      return OrderState.Approved;
    case "REJECTED":
      return OrderState.Rejected;
    case "CANCEL_PENDING":
      return OrderState.CancelPending;
    case "CANCELLED":
      return OrderState.Cancelled;
    case "REVISION_PENDING":
      return OrderState.RevisionPending;
  }
};

const convertOrderState = (
  input: OrderStateMap[keyof OrderStateMap]
): OrderState => {
  switch (input) {
    case 0:
      return OrderState.ApprovalPending;
    case 1:
      return OrderState.Approved;
    case 2:
      return OrderState.Rejected;
    case 3:
      return OrderState.CancelPending;
    case 4:
      return OrderState.Cancelled;
    case 5:
      return OrderState.RevisionPending;
    default:
      const exhaustiveCheck: never = input;
      throw new Error(`Unhandled order state case: ${exhaustiveCheck}`);
  }
};

const convertTicketState = (
  input: TicketStateMap[keyof TicketStateMap]
): TicketState => {
  switch (input) {
    case 0:
      return TicketState.CreatePending;
    case 1:
      return TicketState.AwaitingAcceptance;
    case 2:
      return TicketState.Accepted;
    case 3:
      return TicketState.Preparing;
    case 4:
      return TicketState.ReadyForPickup;
    case 5:
      return TicketState.PickedUp;
    case 6:
      return TicketState.CancelPending;
    case 7:
      return TicketState.Cancelled;
    case 8:
      return TicketState.RevisionPending;
    default:
      const exhaustiveCheck: never = input;
      throw new Error(`Unhandled ticket state case: ${exhaustiveCheck}`);
  }
};

const convertDeliveryState = (
  input: DeliveryStateMap[keyof DeliveryStateMap]
): DeliveryState => {
  switch (input) {
    case 0:
      return DeliveryState.Pending;
    case 1:
      return DeliveryState.Scheduled;
    case 2:
      return DeliveryState.Cancelled;
    default:
      const exhaustiveCheck: never = input;
      throw new Error(`Unhandled ticket state case: ${exhaustiveCheck}`);
  }
};

const convertDeliveryAction = (
  input: DeliveryActionTypeMap[keyof DeliveryActionTypeMap]
): DeliveryAction => {
  switch (input) {
    case 0:
      return DeliveryAction.Pickup;
    case 1:
      return DeliveryAction.Dropoff;
    default:
      const exhaustiveCheck: never = input;
      throw new Error(`Unhandled delivery action case: ${exhaustiveCheck}`);
  }
};

const convertTicketLineItem = (input: TicketLineItemInput): TicketLineItem => ({
  quantity: input.getQuantity(),
  menuItemId: input.getMenuitemid(),
  name: input.getName(),
});

export const convertDelivery = (input: DeliveryInput): Delivery => {
  const deliveryInfo = input.getDeliveryinfo()!;
  const assignedCourierId = input.getAssignedcourierid();
  return {
    id: deliveryInfo.getId(),
    state: convertDeliveryState(deliveryInfo.getState()),
    pickupTime: deliveryInfo.getPickuptime()?.toDate().toISOString(),
    deliveryTime: deliveryInfo.getDeliverytime()?.toDate().toISOString(),
    assignedCourier: assignedCourierId ? emptyCourier(assignedCourierId) : null,
    courierActions: input.getCourieractionsList().map((info) => ({
      type: convertDeliveryAction(info.getType()),
    })),
    ticket: emptyTicket(deliveryInfo.getId()),
  };
};

export const convertCourier = (input: CourierInput): Courier => ({
  id: input.getId(),
  available: input.getAvailable(),
  plan: emptyCourierPlan(),
});

export const convertCourierPlan = (input: CourierPlanInput): CourierPlan => ({
  actions: input.getActionsList().map(convertCourierAction),
});

const convertCourierAction = (input: CourierActionInput): CourierAction => ({
  type: convertDeliveryAction(input.getType()),
  address: input.getAddress(),
  delivery: emptyDelivery(input.getDeliveryid()),
  time: input.getTime()!.toDate().toISOString(),
});

const convertMoney = (input: MoneyInput): Money => ({
  amount: input.amount,
});

const convertMoneyPb = (input: MoneyPb): Money => ({
  amount: input.getAmount(),
});
