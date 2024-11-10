import { AuthResponse, LoginRequest } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const authService = new AuthenticationService();
  const [user, authToken] = await authService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
