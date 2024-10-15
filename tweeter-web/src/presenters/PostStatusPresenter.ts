import { User, AuthToken, Status } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ) {
    event.preventDefault();

    try {
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  }
}
