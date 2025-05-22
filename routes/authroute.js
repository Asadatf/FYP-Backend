import express from "express";
import { verifyTokenDirect } from "../controllers/verifyTokens.js";

const router = express.Router();

router.post("/verifyToken", verifyTokenDirect);

export default router;
