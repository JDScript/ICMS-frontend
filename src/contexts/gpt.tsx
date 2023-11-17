import MainService, { GPTService } from "@/service";
import { useRequest } from "ahooks";
import { createContext, useContext, useRef, useState } from "react";
import { useUser } from "./user";

interface IGPTContext {
  loading: boolean;
  userSendMsg: (msg: string) => Promise<void>;
  messages: GPT.Message[];
}

const GPTContext = createContext<IGPTContext>({} as any);

const SYSTEM = `
1. You are a helpful assistant called ICMS GPT on the Intelligent Course Management System.
2. You should answer all questions clear and concise, do not give additional information when you are not asked to. 
3. Whenever you need to do calculations, use the tool call_javascript.
4. Whenever you need to know the time, use the tool call_javascript and always use timezone Asia/Hong_Kong.
5. You can know user's enrolment records by use the tool fetch_enrolments.
6. You do not need user's student id to enrol in a course.
7. You can get course's id by search the course.
`;
const TOOLS: GPT.Tool[] = [
  {
    type: "function",
    function: {
      name: "fetch_enrolments",
      description:
        "fetching current user's course enrolments data, including course information and its timeslots. The response will be in json format containing an array of all user's enroled courses. In course.timeslots, each timeslot will be repeated on week basis.",
      parameters: {
        type: "object",
        properties: {
          dummy: {
            type: "string",
            description: "NEVER USE",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "call_javascript",
      description: "Return running result of javascript using eval() function",
      parameters: {
        type: "object",
        properties: {
          functionScript: {
            type: "string",
            description: "javascript to be run",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_course",
      description:
        "Search over the full course database, will return at most 20 relavant courses.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "keyword used to search for course",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "enrol_in_course",
      description:
        "Enrol in a course using a course's id, only id of the course is required to enrol in a course",
      parameters: {
        type: "object",
        properties: {
          course_id: {
            type: "number",
            description: "id of the course you want to enrolled in",
          },
        },
        required: ["course_id"],
      },
    },
  },
];

export const GPTProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<GPT.Message[]>([]);
  const messagesHistory = useRef<GPT.Message[]>([]);

  const { runAsync: send, loading } = useRequest(GPTService.completions, {
    manual: true,
  });

  const { enrolments, refreshEnrolments } = useUser();

  const sendMsg = async (msg: GPT.Message[], no_tools = false) => {
    const msgsToSend: GPT.Message[] = [
      { role: "system", content: SYSTEM },
      ...(messagesHistory.current.slice(-10) ?? []),
      ...msg,
    ];

    const resp = await send({
      model: "gpt-35-turbo",
      messages: msgsToSend,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.95,
      tools: !no_tools ? TOOLS : undefined,
      tool_choice: !no_tools ? "auto" : undefined,
    });

    if (!resp.choices[0].message.content) {
      resp.choices[0].message.content = "";
    }

    messagesHistory.current.push(...msg, resp.choices[0].message);
    setMessages(messagesHistory.current);

    if (resp.choices[0].message.tool_calls) {
      const messages: GPT.Message[] = [];
      const tool_calls = resp.choices[0].message.tool_calls;
      for (const tool_call of tool_calls) {
        let result;
        switch (tool_call.function.name) {
          case "fetch_enrolments":
            messages.push({
              tool_call_id: tool_call.id,
              role: "tool",
              name: tool_call.function.name,
              content: JSON.stringify(enrolments),
            });
            break;
          case "call_javascript":
            const script = JSON.parse(tool_call.function.arguments);
            result = eval(script.functionScript);
            messages.push({
              tool_call_id: tool_call.id,
              role: "tool",
              name: tool_call.function.name,
              content: String(result),
            });
            break;
          case "search_course":
            const search = JSON.parse(tool_call.function.arguments).search;
            try {
              result = (await MainService.getCourses({ search: search })).data;
            } catch (e) {
              result = (e as Error).message;
            }
            messages.push({
              tool_call_id: tool_call.id,
              role: "tool",
              name: tool_call.function.name,
              content: JSON.stringify(result),
            });
            break;
          case "enrol_in_course":
            const course_id = JSON.parse(
              tool_call.function.arguments
            ).course_id;
            try {
              result = await MainService.enrolInCourse({ course_id: course_id });
            } catch (e) {
              result = (e as Error).message
            }
            refreshEnrolments();
            messages.push({
              tool_call_id: tool_call.id,
              role: "tool",
              name: tool_call.function.name,
              content: JSON.stringify(result),
            });
            break;
        }
      }
      sendMsg(messages, true);
    }
  };

  const userSendMsg = async (msg: string) => {
    await sendMsg([
      {
        role: "user",
        content: msg,
      },
    ]);
  };

  return (
    <GPTContext.Provider
      value={{
        loading: loading,
        userSendMsg: userSendMsg,
        messages: messages ?? [],
      }}
    >
      {children}
    </GPTContext.Provider>
  );
};

export const useGPT = () => {
  return useContext(GPTContext);
};
