import {
  AuthenticationView,
  AuthenticationPresenter,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public handleLoginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    this.authenticateOnEnter(
      event,
      () => this.checkSubmitButtonStatus(alias, password),
      () => this.doLogin(alias, password, rememberMe, originalUrl)
    );
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    await this.authenticateUser(
      () => this.service.login(alias, password),
      "log user in",
      rememberMe,
      originalUrl ? originalUrl : "/"
    );
  }
}
