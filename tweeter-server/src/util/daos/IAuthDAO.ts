import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";

export interface IAuthDAO {
  createToken(ttlInMinutes: number): Promise<AuthTokenDto>;
  refreshToken(token: string, ttlInMinutes: number): Promise<void>;
  validateToken(token: string, ttlInMinutes: number): Promise<boolean>;
  deleteToken(token: string): Promise<void>;
}
