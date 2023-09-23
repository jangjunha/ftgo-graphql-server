import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/schema.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "..#AppContext",
        arrayInputCorrection: false,
        useIndexSignature: true,
        emitLegacyCommonJSImports: false,
        scalars: {
          DateTimeISO: "string",
          EmailAddress: "string",
        },
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
