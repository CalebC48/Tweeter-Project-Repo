import { Status } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView extends PagedItemView<Status> {}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  StatusItemView,
  Status,
  StatusService
> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
