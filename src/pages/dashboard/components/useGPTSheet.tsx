import { useGPT } from "@/contexts/gpt";
import { Button, Input, Modal, SideSheet, Space } from "@douyinfe/semi-ui";
import { useState } from "react";

const useGPTSheet = () => {
  const [open, setOpen] = useState(false);
  const { messages, loading, userSendMsg } = useGPT();
  const [userInput, setUserInput] = useState("");
  const [msgWaitForReply, setMsgWaitForReply] = useState("");
  const [error, setError] = useState<Error>();

  const sendMsg = async (msg: string) => {
    if (msg.length <= 0) {
      return;
    }

    setError(undefined);
    setMsgWaitForReply(msg);
    setUserInput("");

    try {
      await userSendMsg(msg);
      setMsgWaitForReply("");
    } catch (e) {
      setError(e as Error);
    }
  };

  const sheet = (
    <SideSheet
      placement="right"
      visible={open}
      onCancel={() =>
        Modal.confirm({
          title: "Exit ICMS GPT",
          content: "Are you sure to exit ICMS GPT?",
          onOk: () => setOpen(false),
        })
      }
      title="ICMS GPT"
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        paddingBlockEnd: 24,
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 8,
          boxSizing: "border-box",
          backgroundColor: "var(--semi-color-default)",
          marginBlockEnd: 12,
          overflow: "scroll",
        }}
      >
        {messages
          .filter((v) => v.role != "tool")
          .map((msg, idx) =>
            msg.tool_calls ? (
              <div>{msg.role}: Checking in your system...</div>
            ) : (
              <div key={idx}>
                {msg.role}: {msg.content}
              </div>
            )
          )}
        {msgWaitForReply && <div>{msgWaitForReply}</div>}
      </div>
      <Space>
        {error ? (
          <Button block onClick={() => sendMsg(msgWaitForReply)}>
            Regenerate
          </Button>
        ) : (
          <>
            <Input
              placeholder={
                loading
                  ? "Waiting for reply from ICMS GPT..."
                  : "Message ICMS GPT..."
              }
              disabled={loading}
              value={userInput}
              onChange={setUserInput}
              onSubmitCapture={() => sendMsg(userInput)}
            />
            <Button
              theme="solid"
              loading={loading}
              onClick={() => sendMsg(userInput)}
            >
              Send
            </Button>
          </>
        )}
      </Space>
    </SideSheet>
  );

  return { gptSheet: sheet, open: () => setOpen(true) };
};

export default useGPTSheet;
