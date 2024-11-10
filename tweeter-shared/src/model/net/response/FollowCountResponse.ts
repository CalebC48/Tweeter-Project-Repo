import { TweeterResponse } from "./TweeterResponse";

export interface FollowCountResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
