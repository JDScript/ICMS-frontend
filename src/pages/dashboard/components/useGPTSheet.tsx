import { useGPT } from "@/contexts/gpt";
import { useUser } from "@/contexts/user";
import { IconCustomerSupport } from "@douyinfe/semi-icons";
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations";
import {
  Avatar,
  Button,
  Empty,
  Input,
  Modal,
  SideSheet,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { useState } from "react";
import Markdown from "react-markdown";

const UserMessage = ({ msg }: { msg: GPT.Message }) => {
  const { user } = useUser();
  return (
    <div
      style={{
        display: "flex",
        padding: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          marginInlineEnd: 12,
          paddingTop: 6,
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <Typography.Paragraph>{msg.content}</Typography.Paragraph>
        </div>
      </div>
      <Avatar size="small">{user?.name.slice(0, 1)}</Avatar>
    </div>
  );
};

const AssistantMessage = ({ msg }: { msg: GPT.Message }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: 8,
        flexDirection: "row",
        justifyContent: "flex",
      }}
    >
      <Avatar size="small">
        <IconCustomerSupport />
      </Avatar>
      <div style={{ marginInlineStart: 12, paddingTop: 6, flex: 1 }}>
        {msg.tool_calls ? (
          <Typography.Paragraph>Checking in the system...</Typography.Paragraph>
        ) : (
          <Typography.Paragraph>
            <Markdown>{msg.content}</Markdown>
          </Typography.Paragraph>
        )}
      </div>
    </div>
  );
};

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
      style={{ maxWidth: "100%" }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 8,
          boxSizing: "border-box",
          backgroundColor: "var(--semi-color-default)",
          marginBlockEnd: 12,
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length == 0 && (
          <Empty
            style={{
              justifyContent: "center",
              flex: 1,
            }}
            image={<IllustrationNoContent />}
            darkModeImage={<IllustrationNoContentDark />}
            title="You haven't ask any thing!"
            description="Try ask: Have I enrolled in COMP3278?"
          />
        )}
        {messages
          .filter((v) => v.role != "tool")
          .map((msg, idx) =>
            msg.role == "user" ? (
              <UserMessage msg={msg} key={idx} />
            ) : (
              <AssistantMessage msg={msg} key={idx} />
            )
          )}
        {msgWaitForReply && (
          <UserMessage msg={{ role: "user", content: msgWaitForReply }} />
        )}
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
              onEnterPress={() => sendMsg(userInput)}
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
