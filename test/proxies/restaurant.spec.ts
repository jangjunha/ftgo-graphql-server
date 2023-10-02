import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { expect } from "chai";
import path from "path";

const { eachLike, number, string, uuid } = MatchersV3;

const pact = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "ftgo-graphql-server",
  provider: "ftgo-restaurant-service",
});

describe("A Cafe", () => {
  it("returns restaurants list", async () => {
    await pact
      .given("I have a restaurant")
      .uponReceiving("a request for list restaurants")
      .withRequest({
        method: "GET",
        path: "/restaurants/",
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: [
          {
            id: uuid("97e3c4c2-f336-4435-9314-ad1a633495df"),
            name: string("A Cafe"),
            menuItems: eachLike({
              id: string("americano"),
              name: string("Americano"),
              price: { amount: number(2500) },
            }),
          },
        ],
      })
      .executeTest(async (mockserver) => {
        const response = await fetch(new URL("/restaurants/", mockserver.url));
        const result = await response.json();
        expect(result).to.deep.eq([
          {
            id: "97e3c4c2-f336-4435-9314-ad1a633495df",
            name: "A Cafe",
            menuItems: [
              { id: "americano", name: "Americano", price: { amount: 2500 } },
            ],
          },
        ]);
      });
  });

  it("returns an HTTP 200 and restaurant information", async () => {
    await pact
      .given("I have a restaurant")
      .uponReceiving("a request for get information about 'A Cafe' restaurant")
      .withRequest({
        method: "GET",
        path: "/restaurants/97e3c4c2-f336-4435-9314-ad1a633495df/",
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: uuid("97e3c4c2-f336-4435-9314-ad1a633495df"),
          name: string("A Cafe"),
          menuItems: eachLike({
            id: string("americano"),
            name: string("Americano"),
            price: { amount: number(2500) },
          }),
        },
      })
      .executeTest(async (mockserver) => {
        const response = await fetch(
          new URL(
            "/restaurants/97e3c4c2-f336-4435-9314-ad1a633495df/",
            mockserver.url
          )
        );
        const result = await response.json();
        expect(result).to.deep.eq({
          id: "97e3c4c2-f336-4435-9314-ad1a633495df",
          name: "A Cafe",
          menuItems: [
            { id: "americano", name: "Americano", price: { amount: 2500 } },
          ],
        });
      });
  });
});
