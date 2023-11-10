import request from "./utils/request";

class MainService {
  // the value of face should be jpeg image after base64 encoded
  static login = async (data: {
    face: string;
  }): Promise<API.BaseResponse<string>> => {
    return request("/authentications", {
      method: "post",
      data,
      toastError: false,
    });
  };

  static recognizeFace = async (data: {
    face: string;
  }): Promise<API.BaseResponse<API.FaceRecognition>> => {
    return request("/faces", {
      method: "post",
      data,
      toastError: false,
    });
  };

  static register = async (data: {
    name: string;
    email: string;
    descriptors: number[][];
  }): Promise<API.BaseResponse<API.User>> => {
    return request("/users", {
      method: "post",
      data,
    });
  };

  static me = async (): Promise<API.BaseResponse<API.User>> => {
    return request("/me");
  };
}

export default MainService;
