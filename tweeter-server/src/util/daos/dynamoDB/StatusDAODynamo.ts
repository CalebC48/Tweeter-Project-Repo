import { Status } from "tweeter-shared";
import { IStatusDAO } from "../IStatusDAO";

export class StatusDAODynamo implements IStatusDAO {
  putStatus(status: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteStatus(status: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
  geStatus(status: Status): Promise<Status | undefined> {
    throw new Error("Method not implemented.");
  }
  updateStatus(status: Status): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
