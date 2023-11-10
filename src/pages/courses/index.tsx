import { useUser } from "@/contexts/user";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import { IconSearch } from "@douyinfe/semi-icons";
import {
  Button,
  Input,
  Layout,
  List,
  Pagination,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { usePagination } from "ahooks";
import { useState } from "react";

const CoursesPage = () => {
  const [search, setSearch] = useState("");
  const { data, pagination, loading } = usePagination(
    async ({ current, pageSize }) => {
      return extractData(
        MainService.getCourses({
          page: current,
          page_size: pageSize,
          search: search,
        })
      );
    },
    {
      refreshDeps: [search],
      debounceWait: 500,
    }
  );
  const { enrolledInCourse } = useUser();

  return (
    <Layout.Content
      style={{ padding: 24, display: "flex", flexDirection: "column" }}
    >
      <Input
        placeholder={"Search"}
        addonAfter={<IconSearch />}
        value={search}
        onChange={setSearch}
      />
      <List
        loading={loading}
        dataSource={data?.list}
        style={{ paddingBlock: 12, flex: 1 }}
        renderItem={(course) => (
          <div>
            <Typography.Title heading={5}>
              {course.code} - {course.title} [Section {course.section}, {course.year}]
            </Typography.Title>
            <Space vertical align="start">
              <Typography.Paragraph>
                {course.summary ? course.summary : "No summary provided"}
              </Typography.Paragraph>
              <Typography.Paragraph>
                Instructor: {course.instructor}
              </Typography.Paragraph>
              <Button theme="solid" disabled={enrolledInCourse(course.id)}>
                Enrol
              </Button>
            </Space>
          </div>
        )}
      />
      <Pagination {...pagination} style={{ alignSelf: "flex-end" }} />
    </Layout.Content>
  );
};

export default CoursesPage;
