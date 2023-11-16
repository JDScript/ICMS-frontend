import { useUser } from "@/contexts/user";
import {
  Button,
  Card,
  Col,
  Layout,
  List,
  Row,
  Typography,
} from "@douyinfe/semi-ui";
import dayjs from "dayjs";
import CourseCalendar from "./components/CourseCalendar";
import CourseListItem from "@/components/CourseListItem";
import { IconCustomerSupport } from "@douyinfe/semi-icons";
import useGPTSheet from "./components/useGPTSheet";

const DashboardPage = () => {
  const { user, enrolments } = useUser();
  const { gptSheet, open: openGPTSheet } = useGPTSheet();

  return (
    <Layout.Content style={{ padding: 24 }}>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={24} md={12} lg={16} xl={18} xxl={20}>
          <Typography.Title>👋 Welcome back, {user?.name}</Typography.Title>
          <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
            Last login at:
            {user?.last_login_at
              ? dayjs(user.last_login_at).format(" YYYY-MM-DD HH:mm:ss")
              : " Never"}
          </Typography.Text>
          <Button
            icon={<IconCustomerSupport />}
            block
            size="large"
            theme="solid"
            style={{ marginBlockStart: 16 }}
            onClick={() => openGPTSheet()}
          >
            Ask ICMS GPT for help!
          </Button>
          <Card title="Upcoming Session" style={{ marginBlock: 16 }}>
            No upcoming session within 1 hour.
          </Card>
          <Card
            title="My Enrolments"
            style={{ marginBlock: 16 }}
            bodyStyle={{ paddingBlock: 4 }}
          >
            <List
              dataSource={enrolments}
              renderItem={({ course }) => (
                <CourseListItem course={course} key={course.id} />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
          <CourseCalendar mode="day" />
        </Col>
      </Row>
      {gptSheet}
    </Layout.Content>
  );
};

export default DashboardPage;
