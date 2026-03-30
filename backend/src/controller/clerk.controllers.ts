import { Response, Request } from "express";
import { User } from "../models/user.model";

const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const { type: eventType, data } = req.body;
    const { first_name, last_name, image_url } = data || {};
    const email = data?.email_addresses?.[0]?.email_address;

    let fullName = "";
    if (last_name) {
      fullName = `${first_name} ${last_name}`;
    } else {
      fullName = `${first_name}`;
    }

    switch (eventType) {
      case "user.created":
        const isUserDetailsEmpty = [email, fullName, image_url]?.some(
          (field) => field?.trim() === "",
        );
        if (isUserDetailsEmpty) {
          return res.status(400).json({ message: "all fileds are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return res
            .status(409)
            .json({ message: "User with email already exist " });
        }

        const user = await User.create({
          fullName,
          email,
          ImageUrl: image_url,
        });

        if (!user) {
          return res
            .status(500)
            .json({ message: "User not created , Something went wrongs" });
        }
        break;
      default:
        return res
          .status(400)
          .json({ message: `Unhandeled webhook type ${eventType}` });
    }
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export { clerkWebhook };
