import * as controller from "./controllers/auth.controller.js";

export default async function (app) {

  // Mendaftarkan rute POST /login
  app.post("/login", controller.login);
  app.post("/register", controller.register)
  
  app.get("/user", controller.listAllUsers);
  app.get("/user/:student_id", controller.getProfile);

  app.delete("/user/delete/:student_id", controller.removeUser);
  app.put("/user/update/:student_id", controller.updateUser);
}