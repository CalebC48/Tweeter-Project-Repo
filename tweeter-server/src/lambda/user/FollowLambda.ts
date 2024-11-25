import { FollowCountResponse, UserItemRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (
  request: UserItemRequest
): Promise<FollowCountResponse> => {
  const userService = new UserService(new DynamoDBFactory());

  const [followerCount, followeeCount] = await userService.follow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
