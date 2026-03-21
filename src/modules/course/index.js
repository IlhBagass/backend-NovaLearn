import routes from "./course.routes.js";

export default async function (app) {
  app.register(routes);
}