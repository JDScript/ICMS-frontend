import request from "@/utils/request";

export class GPTService {
  static completions = async (req: GPT.Request): Promise<GPT.Response> => {
    return request("/chat/completions", {
      method: "post",
      data: req,
      params: {
        "api-version": "2023-09-01-preview",
      },
    });
  };
}
