import { UserDto } from "../../dto/UserDto";
import { UserItemRequest } from "./UserItemRequest";

export interface IsFollowerRequest extends UserItemRequest {
  readonly selectedUser: UserDto;
}
