import { Status } from "tweeter-shared";

export interface IFeedDAO {
  putFeed(feed: Status): Promise<void>;

  deleteFeed(feed: Status): Promise<void>;

  getFeed(feed: Status): Promise<Status | undefined>;

  updateFeed(feed: Status): Promise<void>;
}
