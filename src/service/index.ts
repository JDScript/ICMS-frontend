import request from "../utils/request";

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

  static enrolInCourse = async (data: {
    course_id: number;
  }): Promise<API.BaseResponse<Partial<API.Enrolment>>> => {
    return request("/me/enrolments", { method: "post", data });
  };

  static getMyActivities = async (
    params: API.PaginationParams
  ): Promise<API.BaseResponse<API.BasePagination<API.Activity>>> => {
    return request("/me/activities", { params });
  };

  static getMyMessages = async (
    params: API.PaginationParams & { unread?: boolean; course_id?: number }
  ): Promise<API.BaseResponse<API.BasePagination<API.CourseMessage>>> => {
    return request("/me/messages", { params });
  };

  static clearMyActivities = async (): Promise<null> => {
    return request("/me/activities", { method: "delete" });
  };

  static getCourseDetail = async (
    course_id: number
  ): Promise<API.BaseResponse<API.Course>> => {
    return request(`/courses/${course_id}`);
  };

  static getCourseSections = async (
    course_id: number
  ): Promise<API.BaseResponse<API.CourseSection[]>> => {
    return request(`/courses/${course_id}/sections`);
  };

  static getCourseMessages = async (
    course_id: number,
    params: API.PaginationParams
  ): Promise<API.BaseResponse<API.BasePagination<API.CourseMessage>>> => {
    return request(`/courses/${course_id}/messages`, { params });
  };

  static readMessages = async (data: {
    messages_id: number[];
  }): Promise<null> => {
    return request("/me/messages", {
      method: "delete",
      data,
    });
  };
}

export * from "./gpt";
export default MainService;
