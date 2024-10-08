import { User, AuthToken, FakeData } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private authService: AuthenticationService;

  public constructor(view: LoginView) {
    this._view = view;
    this.authService = new AuthenticationService();
  }

  protected get view(): LoginView {
    return this._view;
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
    if (
      event.key === "Enter" &&
      !this.checkSubmitButtonStatus(alias, password)
    ) {
      this.doLogin(alias, password, rememberMe, originalUrl);
    }
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    try {
      const [user, authToken] = await this.authService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}
