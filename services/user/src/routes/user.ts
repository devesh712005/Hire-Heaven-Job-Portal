import express from "express";
import { isAuth } from "../middlewares/auth.js";
import {
  getUserProfile,
  myprofile,
  updateUserProfile,
} from "../controllers/user.js";
const router = express.Router();
router.get("/me", isAuth, myprofile); // My Profile
router.get("/:userId", isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);
export default router;
