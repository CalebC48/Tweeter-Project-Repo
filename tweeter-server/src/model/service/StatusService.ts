import { StatusDto } from "tweeter-shared";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IAuthDAO } from "../../util/daos/IAuthDAO";
import { IStatusDAO } from "../../util/daos/IStatusDAO";
import { IUserDAO } from "../../util/daos/IUserDAO";
import { IFeedDAO } from "../../util/daos/IFeedDAO";
import { IFollowDAO } from "../../util/daos/IFollowDAO";

export class StatusService {
  private userDAO: IUserDAO;
  private authDAO: IAuthDAO;
  private statusDAO: IStatusDAO;
  private feedDAO: IFeedDAO;
  private followDao: IFollowDAO;

  constructor(daoFactory: IDAOFactory) {
    this.userDAO = daoFactory.createUserDAO();
    this.authDAO = daoFactory.createAuthDAO();
    this.statusDAO = daoFactory.createStatusDAO();
    this.feedDAO = daoFactory.createFeedDAO();
    this.followDao = daoFactory.createFollowDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const verify = await this.authDAO.validateToken(token, 5);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const lastKey = lastItem
      ? `${new Date(lastItem.timestamp).toISOString()}&${lastItem.user.alias}`
      : undefined;

    const page = await this.feedDAO.getPageOfStatuses(
      userAlias,
      pageSize,
      lastKey
    );

    page.values = await this.populateUsers(page.values);

    return [page.values, page.hasMorePages];
  }

  public async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const verify = await this.authDAO.validateToken(authToken, 5);

    if (!verify) {
      throw new Error("Invalid token");
    }

    const page = await this.statusDAO.getPageOfStatuses(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );

    page.values = await this.populateUsers(page.values);

    return [page.values, page.hasMorePages];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const verify = await this.authDAO.validateToken(token, 5);

    if (!verify) {
      throw new Error("Invalid token");
    }

    if (newStatus) {
      await this.statusDAO.putStatus(newStatus);
    } else {
      throw new Error("newStatus cannot be null");
    }
    console.log("Status put");
  }

  public async postFeedStatus(
    token: string,
    newStatus: StatusDto,
    followers: string[]
  ): Promise<void> {
    if (newStatus) {
      await this.feedDAO.putFeed(newStatus, followers);
    } else {
      throw new Error("newStatus cannot be null");
    }
  }

  private async populateUsers(values: StatusDto[]): Promise<StatusDto[]> {
    const userAliases = values.map((status) => status.user.alias);

    const users = await this.userDAO.batchGetUsers(userAliases);

    const userMap = new Map(users.map((user) => [user.alias, user]));

    const updatedStatuses = values.map((status) => {
      const userDetails = userMap.get(status.user.alias);

      return {
        ...status,
        user: userDetails
          ? {
              alias: userDetails.alias,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              imageUrl: userDetails.imageUrl,
            }
          : status.user,
      };
    });

    return updatedStatuses;
  }
}
