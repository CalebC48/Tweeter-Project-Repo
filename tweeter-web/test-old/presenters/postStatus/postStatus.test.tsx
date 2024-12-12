// import React from "react";
// import PostStatus from "../../../src/components/postStatus/PostStatus";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom";
// import { anything, instance, mock, verify } from "ts-mockito";
// import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
// import { User, AuthToken } from "tweeter-shared";
// import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";

// jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
//   ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
//   __esModule: true,
//   default: jest.fn(),
// }));

// describe("PostStatus Component", () => {
//   const mockUser: User = mock<User>();
//   const mockAuthToken: AuthToken = mock<AuthToken>();
//   const mockUserInstance = instance(mockUser);
//   const mockAuthTokenInstance = instance(mockAuthToken);

//   beforeAll(() => {
//     (useUserInfo as jest.Mock).mockReturnValue({
//       currentUser: mockUserInstance,
//       authToken: mockAuthTokenInstance,
//     });
//   });

//   it("start with the Post Status and Clear buttons disabled", () => {
//     const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
//     expect(postStatusButton).toBeDisabled();
//     expect(clearButton).toBeDisabled();
//   });

//   it("enables both buttons when the text field has text", async () => {
//     const { postStatusButton, clearButton, textField, user } =
//       renderPostStatusAndGetElement();
//     await user.type(textField, "Test post");

//     expect(postStatusButton).toBeEnabled();
//     expect(clearButton).toBeEnabled();
//   });

//   it("disables both buttons when text field is cleared", async () => {
//     const { postStatusButton, clearButton, textField, user } =
//       renderPostStatusAndGetElement();
//     await user.type(textField, "Test post");

//     expect(postStatusButton).toBeEnabled();
//     expect(clearButton).toBeEnabled();

//     await user.clear(textField);

//     expect(postStatusButton).toBeDisabled();
//     expect(clearButton).toBeDisabled();
//   });

//   it("calls the presenters postStatus method with correct parameters when the Post Status button is pressed", async () => {
//     const mockPresenter = mock<PostStatusPresenter>();
//     const presenter = instance(mockPresenter);

//     const text = "Test post";
//     const { postStatusButton, textField, user } =
//       renderPostStatusAndGetElement(presenter);

//     await user.type(textField, text);

//     await user.click(postStatusButton);
//     verify(
//       mockPresenter.submitPost(anything(), text, anything(), anything())
//     ).once();
//   });
// });

// const renderPostStatus = (presenter?: PostStatusPresenter) => {
//   return render(<PostStatus presenter={presenter} />);
// };

// const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
//   const user = userEvent.setup();

//   renderPostStatus(presenter);

//   const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
//   const clearButton = screen.getByRole("button", { name: /Clear/i });
//   const textField = screen.getByLabelText("status field");

//   return { postStatusButton, clearButton, textField, user };
// };
