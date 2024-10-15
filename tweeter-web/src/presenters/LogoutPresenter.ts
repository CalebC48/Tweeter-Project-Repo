import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";
import { Presenter, MessageView } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo(): void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private authService: AuthenticationService;

  public constructor(view: LogoutView) {
    super(view);
    this.authService = new AuthenticationService();
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    try {
      await this.authService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
