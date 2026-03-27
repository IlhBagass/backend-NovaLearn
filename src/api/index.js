import app from "../src/app.js";

// Vercel butuh handler function seperti ini
export default async function handler(req, res) {
  await app.ready();
  app.server.emit("request", req, res);
}