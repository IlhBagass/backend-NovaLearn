import authRoutes from "./auth.route.js";

export default async function (app) {
  // Pastikan namanya authRoutes, bukan routes
  app.register(authRoutes); 
}