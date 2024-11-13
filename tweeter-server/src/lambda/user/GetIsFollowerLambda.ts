import { BooleanResponse, IsFollowerRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: IsFollowerRequest
): Promise<BooleanResponse> => {
  const userService = new UserService();
  const result = await userService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    result: result,
  };
};
