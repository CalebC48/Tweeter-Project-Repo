import { AuthToken } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";
import React from "react";
import { Status } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let mockAuthService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);

    const presenterSpy = spy(new PostStatusPresenter(mockViewInstance));
    presenter = instance(presenterSpy);

    mockAuthService = mock<StatusService>();
    const mockAuthServiceInstance = instance(mockAuthService);

    (presenter as any)._statusService = mockAuthServiceInstance;
  });

  it("tells the view to display a posting status message", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    await presenter.submitPost(mockEvent, "Test post", authToken, null);

    verify(mockView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    await presenter.submitPost(mockEvent, "Test post", authToken, null);

    const [capturedToken, capturedStatus] = capture(
      mockAuthService.postStatus
    ).last();

    expect(capturedToken).toBe(authToken);
    expect(capturedStatus).toBeInstanceOf(Status);
    expect(capturedStatus.post).toBe("Test post");
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    await presenter.submitPost(mockEvent, "Test post", authToken, null);

    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.setPost("")).once();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("displays an error message and clears the last info message and does not clear the post or display a status posted message when posting of the status fails", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    const error = new Error("Failed to post the status");
    when(mockAuthService.postStatus(anything(), anything())).thenThrow(error);

    await presenter.submitPost(mockEvent, "Test post", authToken, null);

    verify(
      mockView.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      )
    ).once();
    verify(mockView.clearLastInfoMessage()).once();

    verify(mockView.setPost("")).never();
    verify(mockView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
