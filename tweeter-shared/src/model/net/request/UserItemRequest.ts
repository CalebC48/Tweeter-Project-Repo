import { UserDto } from "../../dto/UserDto";

export interface UserItemRequest {
  readonly token: string;
  readonly user: UserDto;
}
