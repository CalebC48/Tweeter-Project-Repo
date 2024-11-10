import { TweeterRequest } from "./TweeterRequest";

export interface AuthtokenRequest extends TweeterRequest {
  readonly token: string;
}
