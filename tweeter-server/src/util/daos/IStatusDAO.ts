import { Status } from "tweeter-shared";

export interface IStatusDAO {
  putStatus(status: Status): Promise<void>;

  deleteStatus(status: Status): Promise<void>;

  geStatus(status: Status): Promise<Status | undefined>;

  updateStatus(status: Status): Promise<void>;
}
