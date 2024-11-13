import { GetUserRequest, UserItemResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<UserItemResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.alias);

  if (!user) {
    return {
      success: false,
      message: "User not found",
      user: null,
    };
  }

  return {
    success: true,
    message: null,
    user: user.dto,
  };
};
