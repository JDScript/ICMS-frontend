import CourseListItem from "@/components/CourseListItem";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import { IconSearch } from "@douyinfe/semi-icons";
import { Input, Layout, List, Pagination } from "@douyinfe/semi-ui";
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
        style={{ flex: 1 }}
        renderItem={(course) => (
          <CourseListItem course={course} key={course.id} showEnrol />
        )}
      />
      <Pagination {...pagination} style={{ alignSelf: "flex-end" }} />
    </Layout.Content>
  );
};

export default CoursesPage;
