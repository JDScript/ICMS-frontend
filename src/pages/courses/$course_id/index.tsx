import Loading from "@/components/Loading";
import MainService from "@/service";
import {
  IconArrowLeft,
  IconFile,
  IconLink,
  IconLive,
  IconMail,
} from "@douyinfe/semi-icons";
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
  IllustrationFailure,
  IllustrationFailureDark,
} from "@douyinfe/semi-illustrations";
import {
  Button,
  Col,
  Collapse,
  Empty,
  Layout,
  Row,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import { useNavigate, useParams } from "react-router-dom";
import NextOrCurrentSession from "./NextOrCurrentSession";
import CourseMessage from "./CourseMessage";

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
      <Row gutter={[8, 16]} type="flex">
        <Col
          xs={24}
          sm={24}
          md={{ span: 12, order: 1 }}
          lg={{ span: 8, order: 1 }}
          xl={{ span: 6, order: 1 }}
          xxl={{ span: 5, order: 1 }}
        >
          <Space align="start">
            <Button
              theme="borderless"
              icon={<IconArrowLeft />}
              onClick={() => navigate("/dashboard")}
              type="tertiary"
            />
            <div>
              <Space vertical align="start">
                <Typography.Title heading={3}>
                  {`${course.code} ${course.title} [Section ${course.section}, ${course.year}]`}
                </Typography.Title>
                <div>
                  <Typography.Paragraph>
                    Instructor: {course.instructor}
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    style={{ color: "var(--semi-color-text-2)" }}
                  >
                    {course.summary ? course.summary : "No summary provided"}
                  </Typography.Paragraph>
                </div>
                <Space>
                  <Button
                    icon={<IconLive />}
                    disabled={!course.zoom_link}
                    theme="solid"
                    onClick={() => {
                      window.open(course.zoom_link);
                    }}
                  >
                    Zoom link
                  </Button>
                  <Button icon={<IconMail />} theme="borderless">
                    Send by email
                  </Button>
                </Space>
                <NextOrCurrentSession course={course} />
              </Space>
            </div>
          </Space>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={{ span: 12, order: 2 }}
          lg={{ span: 6, order: 3 }}
          xl={{ span: 6, order: 3 }}
          xxl={{ span: 5, order: 3 }}
        >
          <CourseMessage course={course} />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={{ span: 24, order: 3 }}
          lg={{ span: 10, order: 2 }}
          xl={{ span: 12, order: 2 }}
          xxl={{ span: 14, order: 2 }}
        >
          {sections.length > 0 ? (
            <Collapse clickHeaderToExpand style={{ marginBlock: 12 }} accordion>
              {sections.map((section) => (
                <Collapse.Panel
                  key={section.id}
                  itemKey={section.id.toString()}
                  header={
                    <Typography.Title heading={4}>
                      {section.name}
                    </Typography.Title>
                  }
                >
                  <span dangerouslySetInnerHTML={{ __html: section.summary }} />
                  {section.modules.map((module) => (
                    <div
                      style={{ marginInline: module.indent * 24 }}
                      key={module.id}
                    >
                      <Typography.Text
                        link={{ href: module.link, target: "_blank" }}
                        icon={
                          module.module_type == "link" ? (
                            <IconLink />
                          ) : (
                            <IconFile />
                          )
                        }
                      >
                        {module.name}
                      </Typography.Text>
                    </div>
                  ))}
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : (
            <Empty
              title="Empty"
              description="Still waiting for instructor to upload course materials!"
              image={<IllustrationConstruction />}
              darkModeImage={<IllustrationConstructionDark />}
              style={{ marginBlock: 24 }}
            />
          )}
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default CourseDetailPage;
