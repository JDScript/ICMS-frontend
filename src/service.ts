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

  static getCourses = async (
    params: API.PaginationParams & { search?: string }
  ): Promise<API.BaseResponse<API.BasePagination<API.Course>>> => {
    return request("/courses", { params });
  };

  static getEnrolments = async (): Promise<
    API.BaseResponse<API.Enrolment[]>
  > => {
    return request("/me/enrolments");
  };
}

export default MainService;
