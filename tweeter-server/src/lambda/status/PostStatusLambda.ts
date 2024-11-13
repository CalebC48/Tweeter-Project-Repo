import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { PostStatusRequest } from "tweeter-shared/dist/model/net/request/PostStatusRequest";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const success = await statusService.postStatus(request.token, request.status);

  return {
    success: true,
    message: null,
  };
};
