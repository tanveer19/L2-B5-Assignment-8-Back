// import dotenv from "dotenv";
// dotenv.config();

// const env = {
//   // Server
//   port: process.env.PORT || 5000,
//   node_env: process.env.NODE_ENV || "development",

//   // Database
//   database_url: process.env.DATABASE_URL as string,

//   // JWT
//   jwt_secret: process.env.JWT_SECRET as string,
//   jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",

//   // Cloudinary
//   cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
//   cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
//   cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,

//   // Frontend URL
//   frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",

//   // Stripe
//   stripe_secret_key: process.env.STRIPE_SECRET_KEY as string,
// };

// export default env;
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID as string,
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID as string,
};
