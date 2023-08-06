import { ChannelCredentials } from "@grpc/grpc-js";

import { KitchenServiceClient } from "@jangjunha/ftgo-proto/lib/kitchens_grpc_pb";

export const kitchenService = new KitchenServiceClient(
  process.env.KITCHEN_SERVICE_URL!,
  ChannelCredentials.createInsecure()
);
