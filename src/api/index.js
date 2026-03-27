import Fastify from "fastify";
import registerPlugin from "../src/plugins/index.js";

const app = Fastify({ logger: false }); // matikan logger di production

// Register plugins sekali saja
const initApp = async () => {
  await registerPlugin(app);

  app.get("/", async () => {
    return { message: "API berhasil" };
  });

  await app.ready();
  return app;
};

// Simpan promise agar tidak init ulang setiap request
const appPromise = initApp();

export default async function handler(req, res) {
  const fastify = await appPromise;
  fastify.server.emit("request", req, res);
}