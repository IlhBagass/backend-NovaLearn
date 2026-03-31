import routes from "./annc.route.js";

export default async function (app) {
  app.register(routes);
}