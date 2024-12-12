import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ) {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      console.log("posting status from presenter");
      await this._statusService.postStatus(authToken!, status);
      console.log("posted status, back in presenter");
      this.view.setPost("");
      console.log("displaying message status posted");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
  }
}
