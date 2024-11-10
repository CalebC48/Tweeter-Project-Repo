import { TweeterResponse } from "./TweeterResponse";

export interface SingleCountResponse extends TweeterResponse {
  readonly count: number;
}
