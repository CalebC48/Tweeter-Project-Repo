import { AuthToken, User, FakeData, UserDto, Follow } from "tweeter-shared";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IFollowDAO } from "../../util/daos/IFollowDAO";
import { IUserDAO } from "../../util/daos/IUserDAO";

export class FollowService {
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;

  constructor(daoFactory: IDAOFactory) {
    this.followDAO = daoFactory.createFollowDAO();
    this.userDAO = daoFactory.createUserDAO();
  }

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const items = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );
    return this.getDtos(items.values, items.hasMorePages);
  }

  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const items = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );
    return this.getDtos(items.values, items.hasMorePages);
  }

  private async getDtos(
    items: Follow[],
    hasMore: boolean
  ): Promise<[UserDto[], boolean]> {
    // const dtos = items.map((user) => user.dto);
    // return [dtos, hasMore];
    return [[], false];
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
