import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Password } from "../utils/password";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body("password").trim().notEmpty().withMessage("Password not provided")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError("Invalid credentials");

    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) throw new BadRequestError("Invalid credentials");

    // Generate JWT
    const payload = { id: user._id, email: user.email };
    const userJwt = jwt.sign(payload, process.env.JWT_KEY!);

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  });

export { router as signinRouter };