import { User, FakeData, UserDto } from "tweeter-shared";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IUserDAO } from "../../util/daos/IUserDAO";
import { IAuthDAO } from "../../util/daos/IAuthDAO";
import { IFollowDAO } from "../../util/daos/IFollowDAO";

export class UserService {
  private userDAO: IUserDAO;
  private authDAO: IAuthDAO;
  private followDAO: IFollowDAO;

  constructor(daoFactory: IDAOFactory) {
    this.userDAO = daoFactory.createUserDAO();
    this.authDAO = daoFactory.createAuthDAO();
    this.followDAO = daoFactory.createFollowDAO();
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    return this.followDAO.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    console.log("Getting followee count");
    const follows = await this.userDAO.getFollows(user.alias);
    return follows[1];
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    console.log("Getting follower count");
    const follows = await this.userDAO.getFollows(user.alias);
    return follows[0];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    console.log("Following user", userToFollow);
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const currentUserAlias = await this.authDAO.getUser(token);
    console.log("Current user alias", currentUserAlias);

    if (!currentUserAlias) {
      throw new Error("User not found");
    }

    console.log("Putting follow");
    this.followDAO.putFollow({
      follower_handle: currentUserAlias,
      followee_handle: userToFollow.alias,
    });

    console.log("Incrementing follow");
    await this.userDAO.increamentFollow(userToFollow.alias, false);
    await this.userDAO.increamentFollow(currentUserAlias, true);

    console.log("Getting follower count");
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    console.log("Returning counts", followerCount, followeeCount);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const verify = await this.authDAO.validateToken(token, 60);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const currentUserAlias = await this.authDAO.getUser(token);

    if (!currentUserAlias) {
      throw new Error("User not found");
    }

    this.followDAO.deleteFollow({
      follower_handle: currentUserAlias,
      followee_handle: userToUnfollow.alias,
    });

    this.userDAO.decreamentFollow(userToUnfollow.alias, false);
    this.userDAO.decreamentFollow(currentUserAlias, true);

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
