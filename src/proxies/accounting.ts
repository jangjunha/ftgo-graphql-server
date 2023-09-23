import axios, { AxiosInstance } from "axios";
import path from "path";
import { Money } from "./money";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { generateAuthHeaders } from "../auth";

export interface Account {
  id: string;
  balance: Money;
}

export interface AccountDetails {
  id: string;
  amount: Money;
}

export class AccountingService {
  private client: AxiosInstance;

  constructor(baseURL: string, auth?: AuthResult) {
    this.client = axios.create({
      baseURL,
      headers: generateAuthHeaders(auth),
    });
  }

  async findAccount(id: string): Promise<AccountDetails> {
    const res = await this.client.get(path.join("./accounts/", id, "./"));
    return res.data as AccountDetails;
  }

  async depositAccount(id: string, amount: Money): Promise<Account> {
    const res = await this.client.post(
      path.join("./accounts/", id, "./deposit/"),
      amount
    );
    return res.data as Account;
  }

  async withdrawAccount(id: string, amount: Money): Promise<Account> {
    const res = await this.client.post(
      path.join("./accounts/", id, "./withdraw/"),
      amount
    );
    return res.data as Account;
  }
}
