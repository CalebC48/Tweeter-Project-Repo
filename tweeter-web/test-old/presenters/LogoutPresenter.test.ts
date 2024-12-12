// import { AuthToken } from "tweeter-shared";
// import {
//   LogoutPresenter,
//   LogoutView,
// } from "../../src/presenters/LogoutPresenter";
// import { anything, instance, mock, spy, verify, when } from "ts-mockito";
// import { AuthenticationService } from "../../src/model/service/AuthenticationService";

// describe("LogoutPresenter", () => {
//   let mockView: LogoutView;
//   let presenter: LogoutPresenter;
//   let mockAuthService: AuthenticationService;

//   const authToken = new AuthToken("abc123", Date.now());

//   beforeEach(() => {
//     mockView = mock<LogoutView>();
//     const mockViewInstance = instance(mockView);

//     const presenterSpy = spy(new LogoutPresenter(mockViewInstance));
//     presenter = instance(presenterSpy);

//     mockAuthService = mock<AuthenticationService>();
//     const mockAuthServiceInstance = instance(mockAuthService);

//     (presenter as any)._authService = mockAuthServiceInstance;
//   });

//   it("tells the view to display a logging out message", async () => {
//     await presenter.logOut(authToken);
//     verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
//   });

//   it("calls logout on the authentication service with the correct auth token", async () => {
//     await presenter.logOut(authToken);
//     verify(mockAuthService.logout(authToken)).once();
//   });

//   it("tells the view to clear the last info message and clear the user info when logout is succesful", async () => {
//     await presenter.logOut(authToken);
//     verify(mockView.clearLastInfoMessage()).once();
//     verify(mockView.clearUserInfo()).once();

//     verify(mockView.displayErrorMessage(anything())).never();
//   });

//   it("displays an error message and does not clear the last info message and clear the user info when logout fails", async () => {
//     const error = new Error("Failed to log out");
//     when(mockAuthService.logout(authToken)).thenThrow(error);

//     await presenter.logOut(authToken);

//     verify(
//       mockView.displayErrorMessage(
//         `Failed to log user out because of exception: ${error}`
//       )
//     ).once();

//     verify(mockView.clearLastInfoMessage()).never();
//     verify(mockView.clearUserInfo()).never();
//   });
// });
