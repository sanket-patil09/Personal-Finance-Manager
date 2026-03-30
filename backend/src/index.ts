import { configDotenv } from "dotenv";
import connectDb from "./db";
import app from "./app";

// Database and connection methods
const port = 4000;
configDotenv({ path: "./.env" });
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed ", error.message);
  });
