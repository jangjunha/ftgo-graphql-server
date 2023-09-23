import { CallCredentials, ChannelCredentials } from "@grpc/grpc-js";

import { KitchenServiceClient } from "@jangjunha/ftgo-proto/lib/kitchens_grpc_pb";
import {
  AcceptTicketPayload,
  GetTicketPayload,
} from "@jangjunha/ftgo-proto/lib/kitchens_pb";
import { Ticket } from "@jangjunha/ftgo-proto/lib/tickets_pb";
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
      this.client.acceptTicket(payload, (err, _) => {
        if (err != null) {
          throw err;
        }
        resolve(ticketId);
      });
    });
  }
}
