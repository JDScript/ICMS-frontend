import Loading from "@/components/Loading";
import useHostModal from "@/components/useHostModal";
import useMessageSheet from "@/components/useMessageSheet";
import { useUser } from "@/contexts/user";
import {
  IconExit,
  IconMail,
  IconMoon,
  IconRefresh,
  IconSun,
  IconTick,
} from "@douyinfe/semi-icons";
import {
  IllustrationSuccess,
  IllustrationSuccessDark,
} from "@douyinfe/semi-illustrations";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Dropdown,
  Empty,
  Layout,
  List,
  Nav,
  Popover,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "@douyinfe/semi-ui";
import { useLocalStorageState } from "ahooks";
import { Suspense, useEffect, useState } from "react";
import { useOutlet, useNavigate } from "react-router-dom";

const GlobalLayout = () => {
  const [dark, setDark] = useState(false);
  const outlet = useOutlet();
  const {
    token,
    user,
    logout,
    unreadMessages,
    unreadMessagesLoading,
    refreshUnreadMessages,
    readMessages,
    readingMessagesLoading,
  } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setDark(document.body.hasAttribute("theme-mode"));
  }, []);

  const switchMode = () => {
    if (dark) {
      document.body.removeAttribute("theme-mode");
      setDark(false);
    } else {
      document.body.setAttribute("theme-mode", "dark");
      setDark(true);
    }
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.setAttribute("theme-mode", "dark");
      setDark(true);
    } else {
      document.body.removeAttribute("theme-mode");
      setDark(false);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          document.body.setAttribute("theme-mode", "dark");
          setDark(true);
        } else {
          document.body.removeAttribute("theme-mode");
          setDark(false);
        }
      });
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.code === "KeyD") {
        openHostModal();
      }
    });
  }, []);

  const { sheet, openMsg } = useMessageSheet();
  const [host] = useLocalStorageState<string>("host", {
    serializer: (v) => v,
    deserializer: (v) => v,
  });

  const { openHostModal, hostModal } = useHostModal();

  return (
    <Layout style={{ minHeight: "100%" }}>
      <Layout.Header style={{ height: 60 }}>
        <Nav
          mode="horizontal"
          style={{ position: "fixed", zIndex: 999 }}
          header={{
            text: (
              <Typography.Text
                link
                onClick={() => navigate("/dashboard")}
                strong
                style={{ fontSize: 24 }}
              >
                ICMS
              </Typography.Text>
            ),
          }}
          items={[
            {
              text: "Courses",
              onClick: () => navigate("/courses"),
            },
          ]}
          footer={
            <Space>
              <Tooltip
                trigger="hover"
                content={dark ? "Light" : "Dark"}
                position="bottom"
              >
                <Button
                  theme="borderless"
                  icon={
                    dark ? <IconSun size="large" /> : <IconMoon size="large" />
                  }
                  style={{
                    color: "var(--semi-color-text-2)",
                  }}
                  onClick={switchMode}
                />
              </Tooltip>
              {host && (
                <Tooltip
                  trigger="hover"
                  content={"Exit dev mode"}
                  position="bottom"
                >
                  <Button
                    theme="borderless"
                    icon={<IconExit />}
                    style={{
                      color: "var(--semi-color-text-2)",
                    }}
                    onClick={() => {
                      localStorage.removeItem("host");
                      window.location.reload();
                    }}
                  />
                </Tooltip>
              )}
              {token && (
                <Popover
                  trigger="click"
                  position="bottom"
                  style={{ minWidth: 300 }}
                  content={
                    <List
                      size="small"
                      style={{ padding: 0 }}
                      loading={unreadMessagesLoading || readingMessagesLoading}
                      header={
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography.Text strong>
                            Unread messages
                          </Typography.Text>
                          <ButtonGroup style={{ marginRight: -8 }}>
                            <Button
                              theme="borderless"
                              type="tertiary"
                              size="small"
                              icon={<IconRefresh size="small" />}
                              loading={unreadMessagesLoading}
                              onClick={refreshUnreadMessages}
                            />
                            <Button
                              theme="borderless"
                              type="tertiary"
                              size="small"
                              icon={<IconTick size="small" />}
                              loading={readingMessagesLoading}
                              onClick={() => {
                                readMessages({
                                  messages_id: unreadMessages.list.map(
                                    (m) => m.id
                                  ),
                                });
                              }}
                            />
                          </ButtonGroup>
                        </Space>
                      }
                      footer={
                        <Typography.Text
                          link
                          style={{ display: "block", textAlign: "center" }}
                          onClick={() => navigate("/messages")}
                        >
                          View all messages
                        </Typography.Text>
                      }
                      emptyContent={
                        <Empty
                          image={
                            <IllustrationSuccess width={120} height={120} />
                          }
                          darkModeImage={
                            <IllustrationSuccessDark width={120} height={120} />
                          }
                          description="All messages are read"
                        />
                      }
                      dataSource={unreadMessages.list}
                      renderItem={(message) => (
                        <List.Item
                          onClick={() => openMsg(message)}
                          main={
                            <div>
                              <Typography.Paragraph strong>
                                {message.title}
                              </Typography.Paragraph>
                              <Typography.Paragraph
                                style={{
                                  fontSize: 12,
                                }}
                              >{`${message.course?.code}_${message.course?.section}_${message.course?.year}`}</Typography.Paragraph>
                            </div>
                          }
                        />
                      )}
                    />
                  }
                >
                  <Badge
                    count={
                      unreadMessages.total != 0
                        ? unreadMessages.total
                        : undefined
                    }
                    overflowCount={99}
                    type="danger"
                  >
                    <Button
                      theme={unreadMessages.total != 0 ? "light" : "borderless"}
                      icon={<IconMail size="large" />}
                      style={{
                        color: "var(--semi-color-text-2)",
                      }}
                      loading={!user}
                    />
                  </Badge>
                </Popover>
              )}
              {token &&
                (user ? (
                  <Dropdown
                    menu={[
                      { node: "title", name: "Identity: " + user.identity },
                      { node: "item", name: user.name, disabled: true },
                      {
                        node: "item",
                        name: "My activities",
                        onClick: () => navigate("/activities"),
                      },
                      {
                        node: "item",
                        name: "My calendar",
                        onClick: () => navigate("/calendar"),
                      },
                      { node: "item", name: "Logout", onClick: logout },
                    ]}
                  >
                    <Avatar size="small" style={{ marginInlineStart: 4 }}>
                      {user?.name.slice(0, 1)}
                    </Avatar>
                  </Dropdown>
                ) : (
                  <Avatar size="small" style={{ marginInlineStart: 4 }}>
                    <Spin />
                  </Avatar>
                ))}
            </Space>
          }
        />
      </Layout.Header>
      <Layout.Content style={{ minHeight: 0, display: "flex" }}>
        <Suspense fallback={<Loading />}>{outlet}</Suspense>
      </Layout.Content>
      <Layout.Footer
        style={{
          background: "var(--semi-color-tertiary-light-default)",
          paddingBlock: 12,
        }}
      >
        <Space vertical={true} align="center" style={{ width: "100%" }}>
          <Typography.Text type="tertiary">
            ©️ 2023 ICMS, Intelligent Course Management System
          </Typography.Text>
          <Typography.Paragraph type="quaternary" style={{ fontSize: 11 }}>
            Made with love ❤️ to Shuwen
          </Typography.Paragraph>
        </Space>
      </Layout.Footer>
      {sheet}
      {hostModal}
    </Layout>
  );
};

export default GlobalLayout;
