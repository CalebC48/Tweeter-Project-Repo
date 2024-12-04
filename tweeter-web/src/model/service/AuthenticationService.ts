import { User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class AuthenticationService {
  private serverFacade = new ServerFacade();
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login({ alias, password });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageStringBase64,
      imageFileExtension,
    });
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await this.serverFacade.logout({ token: authToken.token });
  }
}
