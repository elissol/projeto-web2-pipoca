import express from "express";
import { loginPage, autenticar } from "../controllers/loginController.js";

const router = express.Router();

router.get("/login", loginPage);
router.post("/login/auth", autenticar);

export default router;
