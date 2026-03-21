import cors from "@fastify/cors";
import authModule from "../modules/auth/index.js"

export default async function registerPlugins(app) {
  await app.register(cors, { origin: "*" });

  // WAJIB ADA INI
  app.register(authModule, { prefix: "/auth" });
  
}