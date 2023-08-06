import { readFileSync } from "fs";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";

export const typeDefs = [
  ...scalarTypeDefs,
  readFileSync("./src/schema.graphql", { encoding: "utf-8" }),
];
