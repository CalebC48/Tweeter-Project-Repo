import { Follow, DataPage } from "tweeter-shared";

export interface IFollowDAO {
  putFollow(follow: Follow): Promise<void>;

  deleteFollow(follow: Follow): Promise<void>;

  getFollow(follow: Follow): Promise<Follow | undefined>;

  updateFollow(follow: Follow): Promise<void>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>>;
}
