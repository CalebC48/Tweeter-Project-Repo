import { UserDto } from "tweeter-shared";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IFollowDAO } from "../../util/daos/IFollowDAO";
import { IUserDAO } from "../../util/daos/IUserDAO";
import { IAuthDAO } from "../../util/daos/IAuthDAO";

export class FollowService {
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;
  private authDAO: IAuthDAO;

  constructor(daoFactory: IDAOFactory) {
    this.followDAO = daoFactory.createFollowDAO();
    this.userDAO = daoFactory.createUserDAO();
    this.authDAO = daoFactory.createAuthDAO();
  }

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const verify = await this.authDAO.validateToken(authToken, 5);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const page = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );
    const followers = page.values.map((follow) => follow.follower_handle);
    return this.getDtos(followers, page.hasMorePages);
  }

  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const verify = await this.authDAO.validateToken(authToken, 5);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const page = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );
    const followees = page.values.map((follow) => follow.followee_handle);
    return this.getDtos(followees, page.hasMorePages);
  }

  private async getDtos(
    items: string[],
    hasMore: boolean
  ): Promise<[UserDto[], boolean]> {
    const dtos = await this.userDAO.batchGetUsers(items);
    return [dtos, hasMore];
  }
}
