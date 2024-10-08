import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayedUser(currentUser!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }
}