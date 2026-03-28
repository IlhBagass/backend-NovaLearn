import "../config/env.js";
import Fastify from "fastify";
import registerPlugin from "../plugins/index.js";

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
  try {
    const fastify = await appPromise;
    fastify.server.emit("request", req, res);
  } catch (error) {
    // Fallback response supaya error startup terlihat jelas di client/log.
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: error?.message || "Failed to initialize server function",
      })
    );
  }
}
