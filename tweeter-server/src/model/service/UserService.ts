import { User, FakeData, UserDto } from "tweeter-shared";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IUserDAO } from "../../util/daos/IUserDAO";
import { IAuthDAO } from "../../util/daos/IAuthDAO";

export class UserService {
  private userDAO: IUserDAO;
  private authDAO: IAuthDAO;

  constructor(daoFactory: IDAOFactory) {
    this.userDAO = daoFactory.createUserDAO();
    this.authDAO = daoFactory.createAuthDAO();
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const res = await this.userDAO.getUser(alias);
    const dto = res?.user;
    return dto ? User.fromDto(dto) : null;
  }
}
