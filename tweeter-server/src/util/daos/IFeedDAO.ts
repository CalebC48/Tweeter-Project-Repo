import { DataPage, Status, StatusDto } from "tweeter-shared";

export interface IFeedDAO {
  putFeed(feed: StatusDto, receiver_aliases: string[]): Promise<void>;

  getPageOfStatuses(
    receiverAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<DataPage<StatusDto>>;
}
