import express, { Request, Response } from "express";
import { requireAuth } from "@dumb-animal/common";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrders };