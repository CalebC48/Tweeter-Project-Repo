import { DataPage, Status, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  putStatus(status: StatusDto): Promise<void>;

  deleteStatus(status: Status): Promise<void>;

  getStatus(
    senderAlias: string,
    timestamp: string
  ): Promise<StatusDto | undefined>;

  batchGetStatuses(senderAliases: string[]): Promise<StatusDto[]>;

  getPageOfStatuses(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusDto>>;
}
