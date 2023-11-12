import { Layout, Typography } from "@douyinfe/semi-ui";
import CourseCalendar from "../dashboard/components/CourseCalendar";

const CalendarPage = () => {
  return (
    <Layout.Content
      style={{ padding: 24, display: "flex", flexDirection: "column" }}
    >
      <Typography.Title>
        📅 This is your weekly course arrangement calendar!
      </Typography.Title>
      <Typography.Paragraph>
        All your enrolled courses will be shown here if they have sessions for you to attend. 
      </Typography.Paragraph>
      <CourseCalendar mode="week" />
    </Layout.Content>
  );
};

export default CalendarPage;
