export interface IS3DAO {
  uploadImage(
    userAlias: string,
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string>;
}
