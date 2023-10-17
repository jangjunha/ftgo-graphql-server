import { CallCredentials, ChannelCredentials } from "@grpc/grpc-js";

import { KitchenServiceClient } from "@jangjunha/ftgo-proto/lib/kitchens_grpc_pb";
import {
  AcceptTicketPayload,
  GetTicketPayload,
  ListTicketPayload,
  TicketEdge,
  Ticket,
  PreparingTicketPayload,
  ReadyForPickupTicketPayload,
} from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import { generateGrpcCredentials } from "../auth";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

export class KitchenService {
  client: KitchenServiceClient;
  credentials: CallCredentials;

  constructor(url: string, auth?: AuthResult) {
    this.client = new KitchenServiceClient(
      url,
      ChannelCredentials.createInsecure()
    );
    this.credentials = generateGrpcCredentials(auth);
  }

  async listTicket(
    restaurantId: string,
    after: string | null,
    first: number | null,
    before: string | null,
    last: number | null
  ): Promise<TicketEdge[]> {
    const payload = new ListTicketPayload();
    payload.setRestaurantid(restaurantId);
    if (after != null) {
      payload.setAfter(after);
    }
    if (first != null) {
      payload.setFirst(first);
    }
    if (before != null) {
      payload.setBefore(before);
    }
    if (last != null) {
      payload.setLast(last);
    }
    return new Promise((resolve, reject) =>
      this.client.listTickets(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            throw new Error("Unexpected null response");
          }
          resolve(value.getEdgesList());
        }
      )
    );
  }

  async getTicket(id: string): Promise<Ticket> {
    const payload = new GetTicketPayload();
    payload.setTicketid(id);
    return new Promise((resolve, reject) =>
      this.client.getTicket(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            throw new Error(`Cannot find ticket ${id}`);
          }
          resolve(value);
        }
      )
    );
  }

  async acceptTicket(ticketId: string, readyBy: string): Promise<string> {
    const payload = new AcceptTicketPayload();
    payload.setTicketid(ticketId);
    payload.setReadyby(Timestamp.fromDate(new Date(readyBy)));
    return new Promise((resolve) => {
      this.client.acceptTicket(
        payload,
        { credentials: this.credentials },
        (err, _) => {
          if (err != null) {
            throw err;
          }
          resolve(ticketId);
        }
      );
    });
  }

  async preparingTicket(ticketId: string): Promise<Ticket> {
    const payload = new PreparingTicketPayload();
    payload.setTicketid(ticketId);
    return new Promise((resolve, reject) => {
      this.client.preparingTicket(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            throw new Error(`Cannot find ticket`);
          }
          resolve(value);
        }
      );
    });
  }

  async readyForPickupTicket(ticketId: string): Promise<Ticket> {
    const payload = new ReadyForPickupTicketPayload();
    payload.setTicketid(ticketId);
    return new Promise((resolve, reject) => {
      this.client.readyForPickupTicket(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            throw new Error(`Cannot find ticket`);
          }
          resolve(value);
        }
      );
    });
  }
}
