import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IFollowDAO } from "../IFollowDAO";
import { Follow, DataPage } from "tweeter-shared";

export class FollowDAODynamo implements IFollowDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateFollowItem(follow),
    };
    const result = await this.client.send(new PutCommand(params));
  }

  async deleteFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(follow),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getFollow(follow: Follow): Promise<Follow | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(follow),
    };
    const response = await this.client.send(new GetCommand(params));
    return response.Item as Follow | undefined;
  }

  async isFollower(
    followerHandle: string,
    followeeHandle: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttr]: followerHandle,
        [this.followeeHandleAttr]: followeeHandle,
      },
    };
    const response = await this.client.send(new GetCommand(params));
    return response.Item !== undefined;
  }

  private generateFollowItem(follow: Follow) {
    return {
      [this.followerHandleAttr]: follow.follower_handle,
      [this.followeeHandleAttr]: follow.followee_handle,
    };
  }

  private generateFollowKey(follow: Follow) {
    return {
      [this.followerHandleAttr]: follow.follower_handle,
      [this.followeeHandleAttr]: follow.followee_handle,
    };
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFolloweeHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follow(item[this.followerHandleAttr], item[this.followeeHandleAttr])
      )
    );

    return new DataPage<Follow>(items, hasMorePages);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: this.followeeHandleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followeeHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followeeHandleAttr]: followeeHandle,
              [this.followerHandleAttr]: lastFollowerHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) =>
      items.push(
        new Follow(item[this.followerHandleAttr], item[this.followeeHandleAttr])
      )
    );

    return new DataPage<Follow>(items, hasMorePages);
  }
}
