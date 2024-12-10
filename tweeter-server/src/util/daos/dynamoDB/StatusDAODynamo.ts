import {
  BatchGetCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage, StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../IStatusDAO";

export class StatusDAODynamo implements IStatusDAO {
  readonly tableName = "story";
  readonly senderAliasAttr = "sender_alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";
  readonly segmentsAttr = "segments";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putStatus(status: StatusDto): Promise<void> {
    console.log("in putStatus");
    const params = {
      TableName: this.tableName,
      Item: this.generateStatusItem(status),
      ConsistentRead: true,
    };
    await this.client.send(new PutCommand(params));
    console.log("putStatus done");
  }

  async deleteStatus(status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateStatusKey(status),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getStatus(
    senderAlias: string,
    timestamp: string
  ): Promise<StatusDto | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.senderAliasAttr]: senderAlias,
        [this.timestampAttr]: timestamp,
      },
    };
    const response = await this.client.send(new GetCommand(params));
    if (response.Item) {
      return this.createStatusDtoFromItem(response.Item);
    }
    return undefined;
  }

  async batchGetStatuses(senderAliases: string[]): Promise<StatusDto[]> {
    if (senderAliases.length === 0) {
      return [];
    }

    const uniqueAliases = [...new Set(senderAliases)];
    const keys = uniqueAliases.map((alias) => ({
      [this.senderAliasAttr]: alias,
    }));

    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    };

    const result = await this.client.send(new BatchGetCommand(params));
    if (result.Responses && result.Responses[this.tableName]) {
      return result.Responses[this.tableName].map<StatusDto>((item) =>
        this.createStatusDtoFromItem(item)
      );
    }
    return [];
  }

  async getPageOfStatuses(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusDto>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.senderAliasAttr} = :senderAlias`,
      ExpressionAttributeValues: {
        ":senderAlias": senderAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastTimestamp
        ? {
            [this.senderAliasAttr]: senderAlias,
            [this.timestampAttr]: new Date(lastTimestamp).toISOString(),
          }
        : undefined,
      ScanIndexForward: false,
    };

    const data = await this.client.send(new QueryCommand(params));

    const items: StatusDto[] =
      data.Items?.map((item) => ({
        user: {
          alias: item[this.senderAliasAttr],
          firstName: "",
          lastName: "",
          imageUrl: "",
        },
        timestamp: new Date(item[this.timestampAttr]).getTime(),
        post: item[this.postAttr],
        segments: item[this.segmentsAttr],
      })) || [];

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<StatusDto>(items, hasMorePages);
  }

  private generateStatusItem(status: StatusDto) {
    return {
      [this.senderAliasAttr]: status.user.alias,
      [this.timestampAttr]: new Date(status.timestamp).toISOString(),
      [this.postAttr]: status.post,
      [this.segmentsAttr]: status.segments,
    };
  }

  private generateStatusKey(status: StatusDto) {
    return {
      [this.senderAliasAttr]: status.user.alias,
      [this.timestampAttr]: new Date(status.timestamp).toISOString(),
    };
  }

  private createStatusDtoFromItem(item: any): StatusDto {
    return {
      user: {
        alias: item[this.senderAliasAttr],
        firstName: "",
        lastName: "",
        imageUrl: "",
      },
      timestamp: new Date(item[this.timestampAttr]).getTime(),
      post: item[this.postAttr],
      segments: item[this.segmentsAttr],
    };
  }
}
