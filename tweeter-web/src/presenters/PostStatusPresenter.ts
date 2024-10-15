import { User, AuthToken, Status } from "tweeter-shared";
import { AuthenticationService } from "../model/service/AuthenticationService";
import { StatusService } from "../model/service/StatusService";
import { View, Presenter } from "./Presenter";

export interface PostStatusView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
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
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  }
}
