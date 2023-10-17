import { CallCredentials, ChannelCredentials } from "@grpc/grpc-js";
import {
  Courier,
  CourierPlan,
  DeliveryStatus,
  DropoffDeliveryPayload,
  GetCourierPayload,
  GetDeliveryStatusPayload,
  PickupDeliveryPayload,
  UpdateCourierAvailabilityPayload,
} from "@jangjunha/ftgo-proto/lib/deliveries_pb";
import { DeliveryServiceClient } from "@jangjunha/ftgo-proto/lib/deliveries_grpc_pb";
import { AuthResult } from "express-oauth2-jwt-bearer";

import { generateGrpcCredentials } from "../auth";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

export class DeliveryService {
  client: DeliveryServiceClient;
  credentials: CallCredentials;

  constructor(url: string, auth?: AuthResult) {
    this.client = new DeliveryServiceClient(
      url,
      ChannelCredentials.createInsecure()
    );
    this.credentials = generateGrpcCredentials(auth);
  }

  async getDelivery(id: string): Promise<DeliveryStatus> {
    const payload = new GetDeliveryStatusPayload();
    payload.setDeliveryid(id);
    return new Promise((resolve, reject) =>
      this.client.getDeliveryStatus(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            throw new Error(`Cannot find delivery ${id}`);
          }
          resolve(value);
        }
      )
    );
  }

  async pickupDelivery(id: string): Promise<void> {
    const payload = new PickupDeliveryPayload();
    payload.setDeliveryid(id);
    return new Promise((resolve, reject) => {
      this.client.pickupDelivery(
        payload,
        { credentials: this.credentials },
        (err, _) => {
          if (err != null) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async dropoffDelivery(id: string): Promise<void> {
    const payload = new DropoffDeliveryPayload();
    payload.setDeliveryid(id);
    return new Promise((resolve, reject) => {
      this.client.dropoffDelivery(
        payload,
        { credentials: this.credentials },
        (err, _) => {
          if (err != null) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async createCourier(): Promise<Courier> {
    return new Promise((resolve, reject) => {
      this.client.createConrier(new Empty(), (err, value) => {
        if (err != null) {
          reject(err);
          return;
        }
        if (value == null) {
          reject(new Error("value is null"));
          return;
        }
        resolve(value);
      });
    });
  }

  async getCourier(id: string): Promise<Courier> {
    const payload = new GetCourierPayload();
    payload.setCourierid(id);
    return new Promise((resolve, reject) => {
      this.client.getCourier(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            reject(new Error("value is null"));
            return;
          }
          resolve(value);
        }
      );
    });
  }

  async getCourierPlan(id: string): Promise<CourierPlan> {
    const payload = new GetCourierPayload();
    payload.setCourierid(id);
    return new Promise((resolve, reject) => {
      this.client.getCourierPlan(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            reject(new Error("value is null"));
            return;
          }
          resolve(value);
        }
      );
    });
  }

  async updateCourierAvailability(
    id: string,
    available: boolean
  ): Promise<void> {
    const payload = new UpdateCourierAvailabilityPayload();
    payload.setCourierid(id);
    payload.setAvailable(available);
    return new Promise((resolve, reject) => {
      this.client.updateCourierAvailability(
        payload,
        { credentials: this.credentials },
        (err, value) => {
          if (err != null) {
            reject(err);
            return;
          }
          if (value == null) {
            reject(new Error("value is null"));
            return;
          }
          resolve();
        }
      );
    });
  }
}
