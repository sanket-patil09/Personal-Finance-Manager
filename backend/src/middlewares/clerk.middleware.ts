import { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";

const verifyClerkWeebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const WEBHOOK_SECRECT = process.env.CLERK_SIGIN_SECRECT;
  if (!WEBHOOK_SECRECT) {
    return res
      .status(500)
      .json({ message: "Please provide webhook secrect in env" });
  }

  const svix_id = (req.headers["svix-id"] || "").toString();
  const svix_timestamp = (req.headers["svix-timestamp"] || "").toString();
  const svix_signature = (req.headers["svix-signature"] || "").toString();

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return res.status(400).json({ message: "Error occured - No svix headers" });
  }
  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };
  const payload = JSON.stringify(req.body);
  const wh = new Webhook(WEBHOOK_SECRECT);

  try {
    await wh.verify(payload, headers);
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Signature" });
  }
};

export { verifyClerkWeebhook };
