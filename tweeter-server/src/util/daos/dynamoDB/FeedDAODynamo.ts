import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
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
    console.log(`Adding status: ${feed.post} to feeds: `, receiverAliases);

    const feedPromises = receiverAliases.map((receiverAlias) => {
      console.log(`Adding status: ${feed.post} to feed: `, receiverAlias);
      const compositeSortKey = `${new Date(feed.timestamp).toISOString()}&${
        feed.user.alias
      }`;

      const params = {
        TableName: this.tableName,
        Item: {
          [this.receiverAliasAttr]: receiverAlias,
          [this.timestampAttr]: compositeSortKey,
          [this.senderAliasAttr]: feed.user.alias,
          post: feed.post,
          segments: feed.segments,
          timestamp: new Date(feed.timestamp).toISOString(),
        },
      };
      return this.client.send(new PutCommand(params));
    });

    console.log("Waiting for all feeds to be added");
    await Promise.all(feedPromises);

    console.log(
      `Finsihed adding status: ${feed.post} to feeds: `,
      receiverAliases
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
      segments: item.segments,
    };
  }
}
