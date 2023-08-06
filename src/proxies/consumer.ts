import axios, { AxiosInstance } from "axios";
import path from "path";

export interface Consumer {
  id: string;
  name: string;
}

export class ConsumerService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  async findConsumer(id: string): Promise<Consumer> {
    const res = await this.client.get(path.join("./consumers/", id, "./"));
    return res.data as Consumer;
  }

  async createConsumer(name: string): Promise<Consumer> {
    const res = await this.client.post("./consumers/", { name });
    return res.data as Consumer;
  }
}
