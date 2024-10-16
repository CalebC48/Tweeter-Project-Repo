import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { AuthenticationService } from "../model/service/AuthenticationService";

export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  protected service: AuthenticationService;

  public constructor(view: V) {
    super(view);
    this.service = new AuthenticationService();
  }

  protected authenticateOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    checkSubmitButtonStatus: () => boolean,
    action: () => void
  ) {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      action();
    }
  }

  protected async authenticateUser(
    action: () => Promise<[User, AuthToken]>,
    actionDescription: string,
    rememberMe: boolean,
    navigateTo: string
  ) {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await action();

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(navigateTo);
    }, actionDescription);
  }
}
