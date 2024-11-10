import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface UserItemResponse extends TweeterResponse {
  readonly user: UserDto | null;
}
