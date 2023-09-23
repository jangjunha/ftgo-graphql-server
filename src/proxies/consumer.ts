import axios, { AxiosInstance } from "axios";
import { AuthResult } from "express-oauth2-jwt-bearer";
import path from "path";
import { generateAuthHeaders } from "../auth";

export interface Consumer {
  id: string;
  name: string;
}

export class ConsumerService {
  private client: AxiosInstance;

  constructor(baseURL: string, auth?: AuthResult) {
    this.client = axios.create({
      baseURL,
      headers: generateAuthHeaders(auth),
    });
  }

  async findConsumer(id: string): Promise<Consumer> {
    const res = await this.client.get(path.join("./consumers/", id, "./"));
    return res.data as Consumer;
  }

  async createConsumer(name: string): Promise<Consumer> {
    const res = await this.client.post(
      "./consumers/",
      { name },
      {
        headers: {
          "x-ftgo-authenticated-client-id": "ftgo-graphql-server",
        },
      }
    );
    return res.data as Consumer;
  }
}
