import { UserDto } from "tweeter-shared";

export interface IUserDAO {
  putUser(user: UserDto, password: string): Promise<void>;

  deleteUser(userAlias: string): Promise<void>;

  getUser(
    userAlias: string
  ): Promise<{ user: UserDto; password: string } | undefined>;

  updateUser(user: UserDto): Promise<void>;

  batchGetUsers(users: string[]): Promise<UserDto[]>;

  increamentFollow(userAlias: string, isFollowee: boolean): Promise<void>;

  decreamentFollow(userAlias: string, isFollowee: boolean): Promise<void>;

  getFollows(userAlias: string): Promise<[number, number]>;
}
