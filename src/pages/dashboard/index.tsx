import { useUser } from "@/contexts/user";
import {
  Button,
  Card,
  Layout,
  List,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import dayjs from "dayjs";
import CourseCalendar from "./components/CourseCalendar";

const DashboardPage = () => {
  const { user, enrolments } = useUser();

  return (
    <Layout.Content style={{ padding: 24 }}>
      <Typography.Title>👋 Welcome back, {user?.name}</Typography.Title>
      <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
        Last login at:
        {user?.last_login_at
          ? dayjs(user.last_login_at * 1000).format(" YYYY-MM-DD HH:mm:ss")
          : " Never"}
      </Typography.Text>
      <CourseCalendar mode="day"/>
      <Card title="Upcoming Session" style={{ marginBlock: 16 }}></Card>
      <Card title="My Enrolments" style={{ marginBlock: 16 }}>
        <List
          dataSource={enrolments}
          renderItem={({ course }) => (
            <List.Item
              style={{ padding: 0 }}
              main={
                <div>
                  <Typography.Title heading={5}>
                    {course.code} - {course.title} [Section {course.section},{" "}
                    {course.year}]
                  </Typography.Title>
                  <Space vertical align="start">
                    <Typography.Paragraph>
                      {course.summary ? course.summary : "No summary provided"}
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      Instructor: {course.instructor}
                    </Typography.Paragraph>
                    <Button theme="solid">Enter course</Button>
                  </Space>
                </div>
              }
            />
          )}
        />
      </Card>
    </Layout.Content>
  );
};

export default DashboardPage;
