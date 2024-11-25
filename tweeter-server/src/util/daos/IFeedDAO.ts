import { Status } from "tweeter-shared";

export interface IFeedDAO {
  put(feed: Status): Promise<void>;

  delete(feed: Status): Promise<void>;

  get(feed: Status): Promise<Status | undefined>;

  update(feed: Status): Promise<void>;
}
