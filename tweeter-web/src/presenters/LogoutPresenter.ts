import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";

export interface LogoutView {
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
  displayErrorMessage(message: string): void;
}

export class LogoutPresenter {
  private _view: LogoutView;
  private authService: AuthenticationService;

  public constructor(view: LogoutView) {
    this._view = view;
    this.authService = new AuthenticationService();
  }

  public async logOut(authToken: AuthToken) {
    try {
      await this.authService.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
