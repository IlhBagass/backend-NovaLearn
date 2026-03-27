import Fastify from "fastify";
import registerPlugin from "./plugins/index.js";

const app = Fastify({logger: true})

await registerPlugin(app)

app.get("/",async () => {
    return { message: "API berhasil" };
});

await app.ready();

export default app;