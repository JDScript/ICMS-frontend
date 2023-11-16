import { GPTService } from "@/service";
import { useRequest } from "ahooks";
import { createContext, useContext, useRef, useState } from "react";
import { useUser } from "./user";

interface IGPTContext {
  loading: boolean;
  userSendMsg: (msg: string) => Promise<void>;
  messages: GPT.Message[];
}

const GPTContext = createContext<IGPTContext>({} as any);

const SYSTEM =
  "You are a helpful assistant called ICMS GPT on the Intelligent Course Management System.";
const TOOLS: GPT.Tool[] = [
  {
    type: "function",
    function: {
      name: "fetch_enrolments",
      description:
        "fetching current user's course enrolments data, including course information and its timeslots. The response will be in json format containing an array of all user's enroled courses.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: [],
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

  const { enrolments } = useUser();

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
        switch (tool_call.function.name) {
          case "fetch_enrolments":
            messages.push({
              tool_call_id: tool_call.id,
              role: "tool",
              name: tool_call.function.name,
              content: JSON.stringify(enrolments),
            });
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
