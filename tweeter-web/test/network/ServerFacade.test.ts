import {
  RegisterRequest,
  UserDto,
  User,
  PagedItemRequest,
  UserItemRequest,
  AuthToken,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  test("Register - should return User and AuthToken on success", async () => {
    const request: RegisterRequest = {
      alias: "testUser",
      password: "password",
      firstName: "Test",
      lastName: "User",
      userImageBytes: "",
      imageFileExtension: "",
    };

    const result = await serverFacade.register(request);

    const [user, authToken] = result!;
    expect(user).toBeInstanceOf(User);
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  test("GetFollowers - should return list of followers and hasMore flag", async () => {
    const request: PagedItemRequest<UserDto> = {
      token: "testToken",
      userAlias: "testUser",
      pageSize: 10,
      lastItem: null,
    };

    // let result: [User[], boolean];

    const result = await serverFacade.getMoreFollowers(request);

    const [followers, hasMore] = result!;
    expect(followers.length).toBeGreaterThan(0);
    followers.forEach((follower) => {
      expect(follower).toBeInstanceOf(User);
    });
    expect(typeof hasMore).toBe("boolean");
  });

  test("GetFollowersCount - should return the followers count", async () => {
    const request: UserItemRequest = {
      token: "test",
      user: {
        alias: "test",
        firstName: "Test",
        lastName: "User",
        imageUrl: "",
      },
    };

    const followersCount = await serverFacade.getFollowerCount(request);

    expect(followersCount).toBeGreaterThan(0);
  });
});
