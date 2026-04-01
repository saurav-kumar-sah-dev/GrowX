import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env is loaded even when this module is imported before the app entrypoint runs.
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ? "set" : "NOT SET",
  api_secret: process.env.API_SECRET ? "set" : "NOT SET"
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export default cloudinary;