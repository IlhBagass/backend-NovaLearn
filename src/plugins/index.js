import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";

import authModule from "../modules/auth/index.js";
import courseModule from "../modules/course/index.js";
import modulModule from "../modules/modul/index.js";
import modulQuiz from "../modules/quiz/index.js";
import anncModule from "../modules/announcement/index.js";

export default async function registerPlugins(app) {
  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  await app.register(authModule, { prefix: "/auth" });
  await app.register(courseModule, { prefix: "/course" });
  await app.register(modulModule, { prefix: "/modul" });
  await app.register(modulQuiz, { prefix: "/quiz" });
  await app.register(anncModule, { prefix: "/announcement" });
}
