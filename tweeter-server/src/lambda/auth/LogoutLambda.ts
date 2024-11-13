import { AuthtokenRequest, TweeterResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";

export const handler = async (
  request: AuthtokenRequest
): Promise<TweeterResponse> => {
  const authService = new AuthenticationService();
  await authService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
