import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  jwt_secret: process.env.JWT_SECRET as string,
};

export default config;
