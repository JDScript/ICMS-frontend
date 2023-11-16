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

  interface CourseMessage {
    id: number;
    course_id: number;
    course?: API.Course;
    title: string;
    content: string;
    read_at: null | number;
    created_at: number;
    updated_at: number;
  }
}

declare namespace GPT {
  interface Request {
    model: "gpt-35-turbo";
    messages: Message[];
    max_tokens: number;
    temperature: number;
    top_p: number;
    tools?: Tool[];
    tool_choice?: "auto";
  }

  interface Response {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    prompt_filter_results: {
      prompt_index: number;
      content_filter_results: ContentFilterResult;
    }[];
    choices: {
      index: number;
      finish_reason: "stop" | "length" | "content_filter" | "tool_calls";
      message: Message;
    }[];
  }

  interface Message {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    tool_calls?: {
      id: string;
      type: string;
      function: {
        name: string;
        arguments: string;
      };
    }[];
    name?: string;
    tool_call_id?: string;
  }

  interface Tool {
    type: "function";
    function: Function;
  }

  interface Function {
    name: string;
    description: string;
    parameters: object;
  }

  interface ContentFilterResult {
    hate: {
      filterer: boolean;
      severity: string;
    };
    self_harm: {
      filterer: boolean;
      severity: string;
    };
    sexual: {
      filterer: boolean;
      severity: string;
    };
    violence: {
      filterer: boolean;
      severity: string;
    };
  }
}
