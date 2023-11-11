import Loading from "@/components/Loading";
import MainService from "@/service";
import { IconArrowLeft, IconFile, IconLink } from "@douyinfe/semi-icons";
import {
  IllustrationFailure,
  IllustrationFailureDark,
} from "@douyinfe/semi-illustrations";
import {
  Button,
  Collapse,
  Empty,
  Layout,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const { data, error, loading, refresh } = useRequest(async () => {
    const { data: sections } = await MainService.getCourseSections(
      Number(course_id) ?? -1
    );
    const { data: course } = await MainService.getCourseDetail(
      Number(course_id) ?? -1
    );

    return { course, sections };
  });
  const navigate = useNavigate();

  if (error) {
    return (
      <Empty
        style={{ marginBlock: 120, flex: 1 }}
        title={error.name}
        description={error.message}
        image={<IllustrationFailure />}
        darkModeImage={<IllustrationFailureDark />}
      >
        <Space
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Button onClick={() => refresh()}>Retry</Button>
          <Button onClick={() => navigate("/dashboard")} theme="solid">
            Back to dashboard
          </Button>
        </Space>
      </Empty>
    );
  }

  if (loading || !data) {
    return <Loading />;
  }

  const { course, sections } = data;

  return (
    <Layout.Content style={{ padding: 24 }}>
      <Space align="start">
        <Button
          icon={<IconArrowLeft />}
          onClick={() => navigate("/dashboard")}
        />
        <Typography.Title heading={3}>
          {`${course.code} ${course.title} [Section ${course.section}, ${course.year}]`}
          <Typography.Text>
            <Typography.Paragraph>
              Instructor: {course.instructor}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ color: "var(--semi-color-text-2)" }}>
              {course.summary ? course.summary : "No summary provided"}
            </Typography.Paragraph>
          </Typography.Text>
        </Typography.Title>
      </Space>
      <Collapse
        clickHeaderToExpand
        defaultActiveKey={sections.map((s) => s.id.toString())}
        style={{ marginBlock: 12 }}
      >
        {sections.map((section) => (
          <Collapse.Panel
            itemKey={section.id.toString()}
            header={
              <Typography.Title heading={4}>{section.name}</Typography.Title>
            }
          >
            <span dangerouslySetInnerHTML={{ __html: section.summary }} />
            {section.modules.map((module) => (
              <div style={{ marginInline: module.indent * 24 }}>
                <Typography.Text
                  link={{ href: module.link, target: "_blank" }}
                  icon={
                    module.module_type == "link" ? <IconLink /> : <IconFile />
                  }
                >
                  {module.name}
                </Typography.Text>
              </div>
            ))}
          </Collapse.Panel>
        ))}
      </Collapse>
    </Layout.Content>
  );
};

export default CourseDetailPage;
