import { IS3DAO } from "../IS3DAO";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

const BUCKET = "your-bucket-name"; // Replace with your S3 bucket name
const REGION = "your-region-name"; // Replace with your AWS region

export default class S3DAODynamoDB implements IS3DAO {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: REGION });
  }

  async uploadImage(
    userAlias: string,
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    const decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
    const key = `images/${userAlias}/${fileName}`;
    const s3Params = {
      Bucket: BUCKET,
      Key: key,
      Body: decodedImageBuffer,
      ContentType: "image/png", // Change if using other image formats
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(s3Params);

    try {
      await this.s3Client.send(command);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`S3 upload failed: ${error}`);
    }
  }
}
