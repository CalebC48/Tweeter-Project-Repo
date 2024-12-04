// shared/daos/factories/IDAOFactory.ts
import { IUserDAO } from "../IUserDAO";
import { IFeedDAO } from "../IFeedDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IStatusDAO } from "../IStatusDAO";
import { IS3DAO } from "../IS3DAO";
import { IAuthDAO } from "../IAuthDAO";

export default interface IDAOFactory {
  createUserDAO(): IUserDAO;
  createFeedDAO(): IFeedDAO;
  createFollowDAO(): IFollowDAO;
  createStatusDAO(): IStatusDAO;
  createAuthDAO(): IAuthDAO;
  createS3DAO(): IS3DAO;
}
