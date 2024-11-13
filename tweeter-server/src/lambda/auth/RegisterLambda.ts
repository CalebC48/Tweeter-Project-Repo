import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const authService = new AuthenticationService();
  const [user, authToken] = await authService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
