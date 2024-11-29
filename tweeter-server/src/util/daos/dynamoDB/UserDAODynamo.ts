import { User, UserDto } from "tweeter-shared";
import { IUserDAO } from "../IUserDAO";
import {
  BatchGetCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UserDAODynamo implements IUserDAO {
  readonly tableName = "users";
  readonly aliasAttr = "user_alias";
  readonly firstNameAttr = "firstname";
  readonly lastNameAttr = "lastName";
  readonly imageUrlAttr = "imageUrl";
  readonly passwordAttr = "password";
  readonly followersAttr = "followers";
  readonly followeesAttr = "followees";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putUser(user: UserDto, password: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateUserItem(user, password),
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteUser(userAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: userAlias,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getUser(
    userAlias: string
  ): Promise<{ user: UserDto; password: string } | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: userAlias,
      },
    };
    const response = await this.client.send(new GetCommand(params));
    if (response.Item) {
      return {
        user: {
          firstName: response.Item[this.firstNameAttr],
          lastName: response.Item[this.lastNameAttr],
          alias: response.Item[this.aliasAttr],
          imageUrl: response.Item[this.imageUrlAttr],
        },
        password: response.Item[this.passwordAttr],
      };
    }
    return undefined;
  }

  async updateUser(user: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: user.alias,
      },
      UpdateExpression:
        "SET #firstName = :firstName, #lastName = :lastName, #imageUrl = :imageUrl",
      ExpressionAttributeNames: {
        "#firstName": this.firstNameAttr,
        "#lastName": this.lastNameAttr,
        "#imageUrl": this.imageUrlAttr,
      },
      ExpressionAttributeValues: {
        ":firstName": user.firstName,
        ":lastName": user.lastName,
        ":imageUrl": user.imageUrl,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async batchGetUsers(userAliases: string[]): Promise<UserDto[]> {
    if (userAliases && userAliases.length > 0) {
      const uniqueUserAliases = [...new Set(userAliases)];
      const keys = uniqueUserAliases.map((alias) => ({
        [this.aliasAttr]: alias,
      }));

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      };

      const result = await this.client.send(new BatchGetCommand(params));
      if (result.Responses) {
        return result.Responses[this.tableName].map<UserDto>((item) => ({
          firstName: item[this.firstNameAttr],
          lastName: item[this.lastNameAttr],
          alias: item[this.aliasAttr],
          imageUrl: item[this.imageUrlAttr],
        }));
      }
    }
    return [];
  }

  async increamentFollow(
    userAlias: string,
    isFollowee: boolean
  ): Promise<void> {
    const field = isFollowee ? this.followeesAttr : this.followersAttr;
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: userAlias,
      },
      UpdateExpression: `SET #${field} = #${field} + :increment`,
      ExpressionAttributeNames: {
        [`#${field}`]: field,
      },
      ExpressionAttributeValues: {
        ":increment": 1,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async decreamentFollow(
    userAlias: string,
    isFollowee: boolean
  ): Promise<void> {
    const field = isFollowee ? this.followeesAttr : this.followersAttr;
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: userAlias,
      },
      UpdateExpression: `SET #${field} = #${field} - :decrement`,
      ConditionExpression: `#${field} > :zero`,
      ExpressionAttributeNames: {
        [`#${field}`]: field,
      },
      ExpressionAttributeValues: {
        ":decrement": 1,
        ":zero": 0,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async getFollows(userAlias: string): Promise<[number, number]> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: userAlias,
      },
      ProjectionExpression: `#followers, #followees`,
      ExpressionAttributeNames: {
        "#followers": this.followersAttr,
        "#followees": this.followeesAttr,
      },
    };

    const response = await this.client.send(new GetCommand(params));
    if (response.Item) {
      return [
        response.Item[this.followersAttr] ?? 0,
        response.Item[this.followeesAttr] ?? 0,
      ];
    }
    return [0, 0];
  }

  private generateUserItem(user: UserDto, password: string) {
    return {
      [this.aliasAttr]: user.alias,
      [this.firstNameAttr]: user.firstName,
      [this.lastNameAttr]: user.lastName,
      [this.imageUrlAttr]: user.imageUrl,
      [this.passwordAttr]: password,
      [this.followersAttr]: 0,
      [this.followeesAttr]: 0,
    };
  }
}
