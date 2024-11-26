import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAuthDAO } from "../IAuthDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";

const AUTH_TOKENS_TABLE = "authtokens";

export default class AuthDAODynamo implements IAuthDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async createToken(ttlInMinutes: number): Promise<AuthTokenDto> {
    const timestamp = Math.floor(Date.now() / 1000);
    const expirationTime = timestamp + ttlInMinutes * 60;
    const token = this.generateToken();
    console.log("Generated token", token);

    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Item: {
        token: token,
        expiresAt: expirationTime,
      },
    };

    console.log("sending token put command:", params);
    await this.client.send(new PutCommand(params));

    return { token, timestamp };
  }

  async refreshToken(token: string, ttlInMinutes: number): Promise<void> {
    const newExpirationTime = Math.floor(Date.now() / 1000) + ttlInMinutes * 60;

    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token: token },
      UpdateExpression: "SET ExpiresAt = :newExpiresAt",
      ExpressionAttributeValues: {
        ":newExpiresAt": newExpirationTime,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }

  async validateToken(token: string, ttlInMinutes: number): Promise<boolean> {
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token: token },
    };

    const response = await this.client.send(new GetCommand(params));

    if (response.Item) {
      await this.refreshToken(token, ttlInMinutes);
      return true;
    }

    return false;
  }

  async deleteToken(token: string): Promise<void> {
    const params = {
      TableName: AUTH_TOKENS_TABLE,
      Key: { token: token },
    };

    await this.client.send(new DeleteCommand(params));
  }
}
