import axios, { AxiosInstance } from "axios";
import path from "path";

import { Money } from "./money";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { generateAuthHeaders } from "../auth";

export interface OrdersResponse {
  orders: Order[];
}

export interface Order {
  orderId: string;
  status: OrderState;
  restaurantId: string;
  restaurantName: string;
  consumerId: string;
  creationDate: string;
  lineItems: OrderLineItem[];
}

export interface OrderLineItem {
  quantity: number;
  menuItemId: string;
  name: string;
  price: Money;
}

export type OrderState =
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCEL_PENDING"
  | "CANCELLED"
  | "REVISION_PENDING";

export class OrderHistoryService {
  private client: AxiosInstance;

  constructor(baseURL: string, auth?: AuthResult) {
    this.client = axios.create({
      baseURL,
      headers: generateAuthHeaders(auth),
    });
  }

  async findOrder(id: string): Promise<Order> {
    const res = await this.client.get(path.join("./orders/", id, "./"));
    return res.data as Order;
  }

  async findOrdersByConsumerId(consumerId: string): Promise<OrdersResponse> {
    const res = await this.client.get("./orders/", { params: { consumerId } });
    return res.data as OrdersResponse;
  }
}
