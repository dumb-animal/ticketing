import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body("password").trim().notEmpty().withMessage("Password not provided")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(200).send("He there!");
  });

export { router as signinRouter };