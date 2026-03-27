import cors from "@fastify/cors";
import authModule from "../modules/auth/index.js";
import courseModule from "../modules/course/index.js";
import modulModule from "../modules/modul/index.js";
import modulQuiz from "../modules/quiz/index.js";

export default async function registerPlugins(app) {
  await app.register(cors, { origin: "*" });

  // WAJIB ADA INI
  app.register(authModule, { prefix: "/auth" });
  app.register(courseModule, {prefix: "/course"})
  app.register(modulModule, {prefix:"/modul"})
  app.register(modulQuiz, {prefix: "/quiz"})
}