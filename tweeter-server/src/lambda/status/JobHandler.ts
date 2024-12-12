import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import DynamoDBFactory from "../../util/daos/factories/DynamoDBFactory";

export const handler = async (event: any) => {
  const statusService = new StatusService(new DynamoDBFactory());
  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();
    const record = event.Records[i];

    const job = JSON.parse(record.body);
    const statusDto: StatusDto = JSON.parse(job.status);

    await statusService.postFeedStatus("token", statusDto, job.followers);

    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
};
