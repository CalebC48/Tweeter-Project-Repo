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
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

export class StatusDAODynamo implements IStatusDAO {
  readonly tableName = "story";
  readonly senderAliasAttr = "sender_alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";
  readonly postQ_url = "https://sqs.us-west-2.amazonaws.com/058264417880/PostQ";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putStatus(status: StatusDto): Promise<void> {
    console.log("in putStatus");
    const putParams = {
      TableName: this.tableName,
      Item: this.generateStatusItem(status),
      ConsistentRead: true,
    };

    const SQSparams = {
      DelaySeconds: 0,
      MessageBody: JSON.stringify(status),
      QueueUrl: this.postQ_url,
    };

    await this.client.send(new PutCommand(putParams));
    console.log("putStatus done");

    try {
      const data = await sqsClient.send(new SendMessageCommand(SQSparams));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
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
      })) || [];

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<StatusDto>(items, hasMorePages);
  }

  private generateStatusItem(status: StatusDto) {
    return {
      [this.senderAliasAttr]: status.user.alias,
      [this.timestampAttr]: new Date(status.timestamp).toISOString(),
      [this.postAttr]: status.post,
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
    };
  }
}
