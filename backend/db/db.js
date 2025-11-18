import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error", err));
