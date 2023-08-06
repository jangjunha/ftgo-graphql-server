import { Consumer } from "../generated/graphql";
import { Consumer as ConsumerInput } from "../proxies/consumer";

export const convertConsumer = (input: ConsumerInput): Consumer => ({
  ...input,
});
