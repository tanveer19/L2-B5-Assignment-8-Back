import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../config/prisma";
import { createUserTokens } from "../../utils/userTokens";

export const AuthService = {
  registerUser: async (payload: any) => {
    const { fullName, email, password } = payload;

    const isExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isExist) {
      throw new AppError(400, "User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName, email, password: hashed },
    });

    return user;
  },

  loginUser: async (payload: any) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Invalid credentials");
    }

    const accessToken = createUserTokens({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user,
    };
  },
};
