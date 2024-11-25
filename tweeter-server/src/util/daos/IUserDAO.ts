import { User } from "tweeter-shared";

export interface IUserDAO {
  putUser(user: User): Promise<void>;

  deleteUser(user: User): Promise<void>;

  getUser(user: User): Promise<User | undefined>;

  updateUser(user: User): Promise<void>;
}
