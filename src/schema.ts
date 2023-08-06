import { readFileSync } from "fs";

export const typeDefs = [
  readFileSync("./src/schema.graphql", { encoding: "utf-8" }),
];
