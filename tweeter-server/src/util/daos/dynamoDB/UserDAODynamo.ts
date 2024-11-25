import { User } from "tweeter-shared";
import { IUserDAO } from "../IUserDAO";

export class UserDAODynamo implements IUserDAO {
  putUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getUser(user: User): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  updateUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
