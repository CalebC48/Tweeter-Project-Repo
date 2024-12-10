// shared/daos/factories/DynamoDBFactory.ts
import IDAOFactory from "./IDAOFactory";
import { IUserDAO } from "../IUserDAO";
import { IFeedDAO } from "../IFeedDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IStatusDAO } from "../IStatusDAO";
import { IS3DAO } from "../IS3DAO";

import { UserDAODynamo } from "../dynamoDB/UserDAODynamo";
import { FeedDAODynamo } from "../dynamoDB/FeedDAODynamo";
import { FollowDAODynamo } from "../dynamoDB/FollowDAODynamo";
import { StatusDAODynamo } from "../dynamoDB/StatusDAODynamo";
import S3DAODynamo from "../dynamoDB/S3DAODynamo";
import { IAuthDAO } from "../IAuthDAO";
import AuthDAODynamo from "../dynamoDB/AuthDAODynamo";

export default class DynamoDBFactory implements IDAOFactory {
  createUserDAO(): IUserDAO {
    return new UserDAODynamo();
  }

  createFeedDAO(): IFeedDAO {
    return new FeedDAODynamo();
  }

  createFollowDAO(): IFollowDAO {
    return new FollowDAODynamo();
  }

  createStatusDAO(): IStatusDAO {
    return new StatusDAODynamo();
  }

  createAuthDAO(): IAuthDAO {
    return new AuthDAODynamo();
  }

  createS3DAO(): IS3DAO {
    return new S3DAODynamo();
  }
}
