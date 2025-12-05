import prisma from "../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserProfile = async (id: string, payload: any) => {
  const exists = await prisma.user.findUnique({
    where: { id },
  });

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 🚀 Remove all undefined fields
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || payload[key] === null) {
      delete payload[key];
    }
  });

  // 🚀 Handle array updates safely — only create set if provided
  if (Array.isArray(payload.interests)) {
    payload.interests = { set: payload.interests };
  }

  if (Array.isArray(payload.visitedCountries)) {
    payload.visitedCountries = { set: payload.visitedCountries };
  }

  // 🚀 If no image uploaded, do not overwrite existing one
  if (!payload.profileImage) {
    delete payload.profileImage;
  }

  return prisma.user.update({
    where: { id },
    data: payload,
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany();
};

const deleteUser = async (id: string) => {
  const exists = await prisma.user.findUnique({ where: { id } });

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({
    where: { id },
  });
};

export const userService = {
  getSingleUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
