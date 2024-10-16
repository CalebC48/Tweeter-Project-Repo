import { User } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends PagedItemView<User> {}

export abstract class UserItemPresenter extends PagedItemPresenter<
  UserItemView,
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
