import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { updateUserValidation } from "./user.validation";

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile fetched successfully.",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = updateUserValidation.parse(req.body);

  const result = await userService.updateUserProfile(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const loggedInUserId = req.user?.id || null;

  const result = await userService.getAllUsers(loggedInUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users fetched successfully.",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await userService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: "User deleted successfully.",
    data: null,
  });
});

export const userController = {
  getSingleUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
