import { GPTService } from "@/service";
import { useRequest } from "ahooks";
import { createContext, useContext, useState } from "react";

interface IGPTContext {
  loading: boolean;
  userSendMsg: (msg: string) => Promise<void>;
  messages: GPT.Message[];
}

const GPTContext = createContext<IGPTContext>({} as any);

const SYSTEM = "You are a helpful assistant called ICMS GPT on the Intelligent Course Management System.";

export const GPTProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<GPT.Message[]>([]);

  const { runAsync: send, loading } = useRequest(GPTService.completions, {
    manual: true,
  });

  const sendMsg = async (msg: GPT.Message) => {
    const msgsToSend: GPT.Message[] = [
      { role: "system", content: SYSTEM },
      ...(messages?.slice(-10) ?? []),
      msg,
    ];

    const resp = await send({
      model: "gpt-35-turbo",
      messages: msgsToSend,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.95,
    });

    setMessages((prev) => [...(prev ?? []), msg, resp.choices[0].message]);
  };

  const userSendMsg = async (msg: string) => {
    await sendMsg({
      role: "user",
      content: msg,
    });
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
