import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.userService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  };

  setNumbFollowees = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.userService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  };

  setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.userService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  };

  followDisplayedUser = async (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.clearLastInfoMessage();
  };

  unfollowDisplayedUser = async (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> => {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.clearLastInfoMessage();
  };
}
