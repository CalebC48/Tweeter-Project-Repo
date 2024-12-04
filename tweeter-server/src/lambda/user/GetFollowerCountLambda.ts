import { SingleCountResponse, UserItemRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (
  request: UserItemRequest
): Promise<SingleCountResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  const followerCount = await userService.getFollowerCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followerCount,
  };
};
