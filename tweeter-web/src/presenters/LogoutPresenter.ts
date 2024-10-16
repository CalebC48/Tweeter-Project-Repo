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

    this.doFailureReportingOperation(async () => {
      await this.authService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
