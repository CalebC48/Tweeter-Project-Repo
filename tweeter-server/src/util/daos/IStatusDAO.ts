import { Status } from "tweeter-shared";

export interface IStatusDAO {
  put(status: Status): Promise<void>;

  delete(status: Status): Promise<void>;

  get(status: Status): Promise<Status | undefined>;

  update(status: Status): Promise<void>;
}
