import axios, { AxiosInstance } from "axios";
import path from "path";

import { Money } from "./money";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { generateAuthHeaders } from "../auth";

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

  constructor(baseURL: string, auth?: AuthResult) {
    this.client = axios.create({
      baseURL,
      headers: generateAuthHeaders(auth),
    });
  }

  async listRestaurants(): Promise<Restaurant[]> {
    const res = await this.client.get("./restaurants/");
    return res.data as Restaurant[];
  }

  async findRestaurant(id: string): Promise<Restaurant> {
    const res = await this.client.get(path.join("./restaurants/", id, "./"));
    return res.data as Restaurant;
  }

  async createRestaurant(restaurant: Omit<Restaurant, "id">): Promise<string> {
    const res = await this.client.post(
      path.join("./restaurants/"),
      restaurant,
      {
        headers: {
          "x-ftgo-authenticated-client-id": "ftgo-graphql-server",
        },
      }
    );
    return res.data.id;
  }
}
