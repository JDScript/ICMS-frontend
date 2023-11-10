import React from "react";
import Loading from "@/components/Loading";
import { useUser } from "@/contexts/user";
import { IconMoon, IconSun } from "@douyinfe/semi-icons";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Layout,
  Nav,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "@douyinfe/semi-ui";
import { Suspense, useEffect, useState } from "react";
import { useOutlet, useNavigate } from "react-router-dom";

const GlobalLayout = () => {
  const [dark, setDark] = useState(false);
  const outlet = useOutlet();
  const { token, user, logout } = useUser();
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

  return (
    <Layout style={{ minHeight: "100%" }}>
      <Layout.Header>
        <Nav
          mode="horizontal"
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
              text: "All Courses",
              onClick: () => navigate("/courses"),
            },
          ]}
          footer={
            <React.Fragment>
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
                    marginRight: "12px",
                  }}
                  onClick={switchMode}
                />
              </Tooltip>
              {token &&
                (user ? (
                  <Dropdown
                    menu={[
                      { node: "title", name: "Identity: " + user.identity },
                      { node: "item", name: user.name, disabled: true },
                      { node: "item", name: "Logout", onClick: logout },
                    ]}
                  >
                    <Avatar size="small">{user?.name.slice(0, 1)}</Avatar>
                  </Dropdown>
                ) : (
                  <Avatar size="small">
                    <Spin />
                  </Avatar>
                ))}
            </React.Fragment>
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
          <Divider />
          <Typography.Text type="tertiary">
            ©️ 2023 ICMS, Intelligent Course Management System
          </Typography.Text>
        </Space>
      </Layout.Footer>
    </Layout>
  );
};

export default GlobalLayout;
