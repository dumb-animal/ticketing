import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  console.log(req.session?.jwt);
  if (!req.session?.jwt) return res.status(200).json({ currentUser: null });

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    return res.status(200).json({ currentUser: payload })
  } catch (err) {
    return res.status(200).json({ currentUser: null })
  }
});

export { router as currentUserRouter };