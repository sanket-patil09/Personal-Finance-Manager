import { Router } from "express";
import { clerkWebhook } from "../controller/clerk.controllers";
import { verifyClerkWeebhook } from "../middlewares/clerk.middleware";

const router = Router();
router.route("/webhooks/register").post(verifyClerkWeebhook, clerkWebhook);

export default router;
