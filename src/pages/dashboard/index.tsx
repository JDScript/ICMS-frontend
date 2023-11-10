import { useUser } from "@/contexts/user";
import { Layout, Typography } from "@douyinfe/semi-ui";
import dayjs from "dayjs";

const DashboardPage = () => {
  const { user } = useUser();

  return (
    <Layout.Content style={{ padding: 24 }}>
      <Typography.Title>👋 Welcome back, {user?.name}</Typography.Title>
      <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
        Last login at:
        {user?.last_login_at
          ? dayjs(user.last_login_at * 1000).format(" YYYY-MM-DD HH:mm:ss")
          : " Never"}
      </Typography.Text>
    </Layout.Content>
  );
};

export default DashboardPage;
