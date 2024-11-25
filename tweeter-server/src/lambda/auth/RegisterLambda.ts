import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const authService = new AuthenticationService(new DynamoDBFactory());
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
