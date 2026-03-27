import modulRoutes from "./modul.route.js"

export default async function (app) {
    app.register(modulRoutes);
}