import { User, AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private authService: AuthenticationService;

  public constructor(view: LoginView) {
    super(view);
    this.authService = new AuthenticationService();
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

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }
}
