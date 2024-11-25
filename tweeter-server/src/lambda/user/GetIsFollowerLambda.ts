import { BooleanResponse, IsFollowerRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<BooleanResponse> => {
  const userService = new UserService(new DynamoDBFactory());
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
