import { Status } from "tweeter-shared";
import { IFeedDAO } from "../IFeedDAO";

export class FeedDAODynamo implements IFeedDAO {
  putFeed(feed: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteFeed(feed: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getFeed(feed: Status): Promise<Status | undefined> {
    throw new Error("Method not implemented.");
  }
  updateFeed(feed: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
