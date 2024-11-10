import { SingleCountResponse, UserItemRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserItemRequest
): Promise<SingleCountResponse> => {
  const userService = new UserService();
  const followeeCount = await userService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
