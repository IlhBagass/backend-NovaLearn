import * as controller from "./controllers/course.controllers.js";

export default async function (app) {
    app.post("/add", controller.addCoourse)

    app.get("/show", controller.showCourse)
    app.get("/showonly/:name_course", controller.showOnly)

    app.delete("/delete/:name_course", controller.deleteCourse)

    app.put("/update/:id", controller.update)
}