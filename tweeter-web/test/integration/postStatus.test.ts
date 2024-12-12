import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../src/presenters/PostStatusPresenter";
import {
  Status,
  PostStatusRequest,
  StatusDto,
  UserDto,
  User,
} from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("Integration Tests", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockAuthService: StatusService;
  let serverFacade: ServerFacade;

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);

    const presenterSpy = spy(new PostStatusPresenter(mockViewInstance));
    presenter = instance(presenterSpy);
    serverFacade = new ServerFacade();

    mockAuthService = mock<StatusService>();
    const mockAuthServiceInstance = instance(mockAuthService);

    (presenter as any)._statusService = mockAuthServiceInstance;
  });

  test("PostStatus - should display message to users and append new status to the user's story", async () => {
    const [user, auth] = await serverFacade.login({
      alias: "calebc48",
      password: "test",
    });

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    const testPost = "Test post";
    const timestampBeforePost = Date.now();

    const status: StatusDto = {
      user: user.dto,
      post: testPost,
      timestamp: timestampBeforePost,
    };

    await presenter.submitPost(mockEvent, testPost, auth, null);
    await serverFacade.postStatus({
      token: auth.token,
      status: status,
    });

    // Verify `displayInfoMessage` was called twice
    verify(mockView.displayInfoMessage(anything(), anything())).twice();

    const [statuses] = await serverFacade.getMoreStoryItems({
      token: auth.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null,
    });

    // console.log(statuses);

    const newStatus = statuses.find(
      (status: Status) =>
        status.post === testPost &&
        status.user.alias === user.alias &&
        status.timestamp >= timestampBeforePost
    );

    // Assertions
    expect(newStatus).not.toBeUndefined();
    expect(newStatus?.post).toBe(testPost);
    expect(newStatus?.user.alias).toBe(user.alias);
    expect(newStatus?.timestamp).toBeGreaterThanOrEqual(timestampBeforePost);
  });
});

export {};
