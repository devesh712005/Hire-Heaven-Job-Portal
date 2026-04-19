import app from "./app.js";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import { connectKafka } from "./utils/producer.js";

dotenv.config();
connectKafka();

async function initDB() {
  try {
    // your DB code (keep as it is)
    console.log("✅ DB ready");
  } catch (error) {
    console.log("Error while creating tables", error);
    process.exit(1);
  }
}

initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Job service running on port ${process.env.PORT}`);
  });
});
