import { UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import IDAOFactory from "../../util/daos/factories/IDAOFactory";
import { IAuthDAO } from "../../util/daos/IAuthDAO";
import { IUserDAO } from "../../util/daos/IUserDAO";
import { IS3DAO } from "../../util/daos/IS3DAO";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export class AuthenticationService {
  private authDAO: IAuthDAO;
  private userDAO: IUserDAO;
  private S3DAO: IS3DAO;

  constructor(daoFactory: IDAOFactory) {
    this.authDAO = daoFactory.createAuthDAO();
    this.userDAO = daoFactory.createUserDAO();
    this.S3DAO = daoFactory.createS3DAO();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userResult = await this.userDAO.getUser(alias);
    console.log(`Got user result: ${userResult}`);

    if (!userResult) {
      throw new Error("Invalid alias or password");
    }

    const { user, password: dbPassword } = userResult;

    console.log("Comparing password: ", password);
    const verify = await this.comparePasswords(password, dbPassword);
    console.log("Password comparison result: ", verify);

    if (user === null || !verify) {
      throw new Error("Invalid alias or password");
    }

    const authtoken = await this.authDAO.createToken(alias, 60);

    console.log(`Returning user and token: ${user}, ${authtoken}`);
    return [user, authtoken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const testUser = await this.userDAO.getUser(alias);
    console.log(`Got test user: ${testUser}`);

    if (testUser) {
      throw new Error("Alias already exists");
    }

    console.log("Hashing password: ", password);
    const hashedPassword = await this.hashPassword(password);
    console.log("Hashed password: ", hashedPassword);

    console.log("Uploading image to S3");
    const imageUrl = await this.S3DAO.uploadImage(
      alias,
      imageFileExtension,
      userImageBytes
    );
    console.log("Image uploaded to S3");

    console.log(
      "Putting user in database: ",
      firstName,
      lastName,
      alias,
      imageUrl
    );
    await this.userDAO.putUser(
      {
        firstName,
        lastName,
        alias,
        imageUrl,
      },
      hashedPassword
    );
    console.log("User put in database");

    const dbUser = await this.userDAO.getUser(alias);
    console.log(`Got user from database: ${dbUser}`);

    if (!dbUser) {
      throw new Error("Invalid registration");
    }

    console.log("Creating token");
    const authtoken = await this.authDAO.createToken(alias, 60);

    console.log("Returning user and token");
    console.log(`User: ${dbUser.user}`);
    console.log(`Token: ${authtoken}`);
    return [dbUser.user, authtoken];
  }

  public async logout(token: string): Promise<void> {
    await this.authDAO.deleteToken(token);
  }
}
