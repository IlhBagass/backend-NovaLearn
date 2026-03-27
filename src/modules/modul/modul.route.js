import * as controller from "../modul/controllers/modul.controller.js"

export default async function (app) {
    app.post("/add", controller.addModule)

    app.get("/show",controller.showModul)
    app.get("/show/:name_module",controller.showModulBy)

    app.delete("/delete/:name_module", controller.deleteModule)

    app.put("/update/:name_module", controller.updateModul)

}