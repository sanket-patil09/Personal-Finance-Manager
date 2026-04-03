import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { getAllTransactions } from "../controller/transaction.controller";

const router = Router();

router.route("/get-all-transactions").get(requireAuth(), getAllTransactions);

export default router;
