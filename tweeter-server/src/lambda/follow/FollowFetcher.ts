import { StatusDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

const jobQ_url = "https://sqs.us-west-2.amazonaws.com/058264417880/JobQ";

const sendJobToQueue = async (job: any) => {
  const params = {
    QueueUrl: jobQ_url,
    MessageBody: JSON.stringify(job),
  };

  try {
    const command = new SendMessageCommand(params);
    await sqsClient.send(command);
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw error;
  }
};

export const handler = async (event: any) => {
  const startTimeMillis = new Date().getTime();

  const followService = new FollowService(new DynamoDBFactory());
  const record = event.Records[0];

  const statusDto: StatusDto = JSON.parse(record.body);

  const aliases = await followService.getFollowerAliases(statusDto.user.alias);

  const jobSize = 25;
  const followerJobs = [];
  for (let j = 0; j < aliases.length; j += jobSize) {
    const job = aliases.slice(j, j + jobSize);
    followerJobs.push(job);
  }

  for (const job of followerJobs) {
    await sendJobToQueue({
      status: record.body,
      followers: job,
    });
  }

  const elapsedTime = new Date().getTime() - startTimeMillis;
  if (elapsedTime < 1000) {
    await new Promise<void>((resolve) =>
      setTimeout(resolve, 1000 - elapsedTime)
    );
  }
};
