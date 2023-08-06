import axios, { AxiosInstance } from "axios";
import path from "path";

import { Money } from "./money";

export interface Restaurant {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: Money;
}

export class RestaurantService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  async findRestaurant(id: string): Promise<Restaurant> {
    const res = await this.client.get(path.join("./restaurants/", id, "./"));
    return res.data as Restaurant;
  }
}
