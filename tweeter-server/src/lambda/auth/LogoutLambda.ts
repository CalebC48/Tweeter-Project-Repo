import { AuthtokenRequest, TweeterResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (
  request: AuthtokenRequest
): Promise<TweeterResponse> => {
  const authService = new AuthenticationService(new DynamoDBFactory());
  await authService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
