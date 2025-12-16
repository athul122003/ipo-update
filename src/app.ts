import express from "express";
import type { Request, Response } from "express";
import { sendWhatsAppMessage } from "./services/whatsapp.js";
import { getIpos } from "./services/ipos.js";
import { sendTelegramMessage } from "./services/telegram.js";
import "./cron/ipoCron.js";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server running" });
});

app.get("/ipo-updates", async (req: Request, res: Response) => {
  const message = await getIpos();
  await sendWhatsAppMessage(message);
  await sendTelegramMessage(message);
  res.json({ success: true });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});