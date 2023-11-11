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
    current_login_at: number;
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

  interface Activity {
    id: number;
    type: string;
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    header: { [key: string]: string[] };
    src_ip: string;
    created_at: number;
    updated_at: number;
  }

  interface CourseSection {
    id: number;
    course_id: number;
    name: string;
    summary: string;
    modules: {
      id: number;
      course_id: number;
      section_id: number;
      name: string;
      module_type: string;
      indent: number;
      link: string;
      extra: any;
      order: number;
      created_at: number;
      updated_at: number;
    }[];
    order: number;
    created_at: number;
    updated_at: number;
  }
}
