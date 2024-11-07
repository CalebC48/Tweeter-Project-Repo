import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("start with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");

    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button when the alias and password fields are filled", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button when either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);

    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "alias2");

    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);

    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const presenter = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "alias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(originalUrl, presenter);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

const renderLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (
  originalUrl?: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
