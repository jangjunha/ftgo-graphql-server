import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { expect } from "chai";
import path from "path";

const pact = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "ftgo-graphql-server",
  provider: "ftgo-restaurant-service",
});

const EXPECTED = {
  id: "97e3c4c2-f336-4435-9314-ad1a633495df",
  name: "A Cafe",
  menuItems: [
    { id: "americano", name: "Americano", price: { amount: "2500" } },
    { id: "latte", name: "Cafe Latte", price: { amount: "3500" } },
  ],
};

describe("A Cafe", () => {
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
        body: MatchersV3.like(EXPECTED),
      })
      .executeTest(async (mockserver) => {
        const response = await fetch(
          new URL(
            "/restaurants/97e3c4c2-f336-4435-9314-ad1a633495df/",
            mockserver.url
          )
        );
        const result = await response.json();
        expect(result).to.deep.eq(EXPECTED);
      });
  });
});
