import { Metadata, credentials } from "@grpc/grpc-js";
import { AuthResult } from "express-oauth2-jwt-bearer";

const AUTH_PREFIX = "https://ftgo.jangjunha.me/auth/";

export const generateAuthHeaders = (
  auth?: AuthResult
): { [key: string]: string } => {
  if (auth == null) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(auth.payload)
      .filter(([key]) => key.startsWith(AUTH_PREFIX))
      .map(([key, value]): [string, string] => [
        key.slice(AUTH_PREFIX.length),
        value as string,
      ])
      .map(([key, value]) => [`x-ftgo-authenticated-${key}`, value])
  );
};

export const generateGrpcCredentials = (auth?: AuthResult) =>
  credentials.createFromMetadataGenerator((_, callback) => {
    const metadata = Metadata.fromHttp2Headers(generateAuthHeaders(auth));
    callback(null, metadata);
  });
