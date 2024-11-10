import {
  AuthResponse,
  AuthToken,
  AuthtokenRequest,
  LoginRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://dcwj2943ta.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/followee/list");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follower/list");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/story");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/feed");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    // Handle errors
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/auth/login");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    const authToken: AuthToken | null =
      response.success && response.authToken
        ? AuthToken.fromDto(response.authToken)
        : null;

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      if (user == null || authToken == null) {
        throw new Error(`No user found`);
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/auth/register");

    console.log(`The response body is '${JSON.stringify(response)}'`);

    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    const authToken: AuthToken | null =
      response.success && response.authToken
        ? AuthToken.fromDto(response.authToken)
        : null;

    // Handle errors
    if (response.success) {
      if (user == null || authToken == null) {
        throw new Error(`Unable to register user`);
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async logout(request: AuthtokenRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      AuthtokenRequest,
      TweeterResponse
    >(request, "/auth/logout");

    // console.log(`The response body is '${JSON.stringify(response)}'`);

    // console.log(`The items are '${JSON.stringify(items)}'`);

    // Handle errors
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }
}
