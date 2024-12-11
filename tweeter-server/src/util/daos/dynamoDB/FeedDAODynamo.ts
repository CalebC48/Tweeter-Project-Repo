import {
  QueryCommand,
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage, StatusDto } from "tweeter-shared";
import { IFeedDAO } from "../IFeedDAO";

export class FeedDAODynamo implements IFeedDAO {
  readonly tableName = "feed";
  readonly receiverAliasAttr = "receiver_alias";
  readonly senderAliasAttr = "sender_alias";
  readonly timestampAttr = "time&sender_alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFeed(feed: StatusDto, receiverAliases: string[]): Promise<void> {
    const putRequests = receiverAliases.map((receiverAlias) => ({
      PutRequest: {
        Item: {
          [this.receiverAliasAttr]: receiverAlias,
          [this.timestampAttr]: `${new Date(feed.timestamp).toISOString()}&${
            feed.user.alias
          }`,
          [this.senderAliasAttr]: feed.user.alias,
          post: feed.post,
          timestamp: new Date(feed.timestamp).toISOString(),
        },
      },
    }));

    const BATCH_SIZE = 25;
    const batches = [];
    for (let i = 0; i < putRequests.length; i += BATCH_SIZE) {
      batches.push(putRequests.slice(i, i + BATCH_SIZE));
    }

    await Promise.all(
      batches.map((batch) =>
        this.client.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: batch,
            },
          })
        )
      )
    );
  }

  async getPageOfStatuses(
    receiverAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<DataPage<StatusDto>> {
    console.log("Fetching page of statuses");

    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.receiverAliasAttr} = :receiverAlias`,
      ExpressionAttributeValues: {
        ":receiverAlias": receiverAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastKey
        ? {
            [this.receiverAliasAttr]: receiverAlias,
            [this.timestampAttr]: lastKey,
          }
        : undefined,
      ScanIndexForward: false,
    };

    const data = await this.client.send(new QueryCommand(params));

    const items: StatusDto[] =
      data.Items?.map((item) => this.createStatusDtoFromItem(item)) || [];

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<StatusDto>(items, hasMorePages);
  }

  private createStatusDtoFromItem(item: any): StatusDto {
    return {
      user: {
        alias: item[this.senderAliasAttr],
        firstName: "",
        lastName: "",
        imageUrl: "",
      },
      timestamp: new Date(item.timestamp).getTime(),
      post: item.post,
    };
  }
}
