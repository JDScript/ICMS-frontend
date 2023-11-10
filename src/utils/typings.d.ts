declare namespace API {
  interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }

  interface BasePagination<T> {
    list: T[];
    total: number;
  }

  interface PaginationParams {
    page?: number;
    page_size?: number;
    sort?: string;
    order?: "desc" | "asc";
  }

  interface User {
    id: number;
    name: string;
    identity: "admin" | "teacher" | "user";
    last_login_at: number;
    last_activity_at: number;
  }

  interface FaceRecognition {
    Rectangle: {
      Min: {
        X: number;
        Y: number;
      };
      Max: {
        X: number;
        Y: number;
      };
    };
    Descriptor: number[];
    Shapes: { X: number; Y: number }[];
  }

  interface Course {
    id: number;
    code: string;
    year: number;
    section: string;
    title: string;
    instructor: string;
    summary: string;
    zoom_link: string;
    slots: {
      day: number;
      venue: string;
      start_time: string;
      end_time: string;
      start_date: string;
      end_date: string;
      remark: string;
    }[];
    created_at: number;
    updated_at: number;
  }

  interface Enrolment {
    course_id: number;
    course: API.Course;
  }
}
