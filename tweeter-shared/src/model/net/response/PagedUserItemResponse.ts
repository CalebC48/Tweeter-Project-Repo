import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse<T> extends TweeterResponse {
  readonly item: T[] | null;
  readonly hasMore: boolean;
}
