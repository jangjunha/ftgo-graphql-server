import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";


async function run() {
  const PORT = 4000;

  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors(), bodyParser.json());

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

run();
