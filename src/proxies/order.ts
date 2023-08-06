import { ChannelCredentials } from "@grpc/grpc-js";

import { OrderServiceClient } from "@jangjunha/ftgo-proto/lib/orders_grpc_pb";

export const orderService = new OrderServiceClient(
  process.env.ORDER_SERVICE_URL!,
  ChannelCredentials.createInsecure()
);
