import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import prisma from "../../config/prisma";
import { generateToken } from "../../utils/jwt";
import AppError from "../../errorHelpers/AppError";

const registerUser = async (payload: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const { fullName, email, password } = payload;

  const isExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const AuthService = {
  registerUser,
};
