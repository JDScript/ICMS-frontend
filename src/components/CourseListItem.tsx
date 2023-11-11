import { useUser } from "@/contexts/user";
import MainService from "@/service";
import { Button, List, Popconfirm, Space, Typography } from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";

const CourseListItem = ({
  course,
  showEnrol = false,
}: {
  course: API.Course;
  showEnrol?: boolean;
}) => {
  const { enrolledInCourse, refreshEnrolments } = useUser();
  const { runAsync: enrol, loading: enrolling } = useRequest(
    MainService.enrolInCourse,
    {
      manual: true,
      onSuccess: () => {
        refreshEnrolments();
      },
    }
  );

  return (
    <List.Item style={{ paddingInline: 0 }}>
      <div>
        <Typography.Title heading={5}>
          {course.code} - {course.title} [Section {course.section},{" "}
          {course.year}]
        </Typography.Title>
        <Space vertical align="start">
          <Typography.Paragraph style={{ color: "var(--semi-color-text-2)" }}>
            {course.summary ? course.summary : "No summary provided"}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Instructor: {course.instructor}
          </Typography.Paragraph>
          <Space>
            {showEnrol ? (
              <>
                <Popconfirm
                  title="Enrol this course?"
                  content="After enrolment, this course will be shown in your dashboard and you'll recieve all notifications from this course."
                  onConfirm={() => enrol({ course_id: course.id })}
                >
                  <Button
                    loading={enrolling}
                    theme="solid"
                    disabled={enrolledInCourse(course.id)}
                  >
                    Enrol
                  </Button>
                </Popconfirm>
                {enrolledInCourse(course.id) && (
                  <Typography.Text strong type="danger">
                    You already enrolled in this course!
                  </Typography.Text>
                )}
              </>
            ) : (
              <Button theme="solid" disabled={!enrolledInCourse(course.id)}>
                Enter course
              </Button>
            )}
          </Space>
        </Space>
      </div>
    </List.Item>
  );
};

export default CourseListItem;
