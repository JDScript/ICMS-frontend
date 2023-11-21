import useMessageSheet from "@/components/useMessageSheet";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations";
import { Empty, Space, Table, Typography } from "@douyinfe/semi-ui";
import { usePagination } from "ahooks";
import { useNavigate } from "react-router-dom";

const CourseMessage = ({ course }: { course: API.Course }) => {
  const { data: messages, loading } = usePagination(
    async () =>
      extractData(
        MainService.getCourseMessages(course.id, {
          page: 1,
          page_size: 5,
        })
      ),
    {}
  );

  const navigate = useNavigate();
  const { sheet, openMsg } = useMessageSheet();

  return (
    <div>
      <Table
        size="small"
        empty={
          <Empty
            image={<IllustrationNoContent height={120} />}
            darkModeImage={<IllustrationNoContentDark height={120} />}
            description="No message posted"
          />
        }
        loading={loading}
        dataSource={messages?.list}
        columns={[
          {
            dataIndex: "title",
            title: "Recent messages",
            render: (_, record) => (
              <Typography.Text
                link
                onClick={() => openMsg({ ...record, course: course })}
              >
                {record.title}
              </Typography.Text>
            ),
          },
        ]}
        pagination={{ currentPage: 1, total: 0, hideOnSinglePage: true }}
        renderPagination={() => (
          <Space
            vertical
            style={{ width: "100%", marginBlock: 4 }}
            spacing="tight"
          >
            <Typography.Paragraph
              type="tertiary"
              style={{ alignSelf: "flex-start", marginInline: 16 }}
            >
              {messages?.list.length} of {messages?.total} messages are shown
            </Typography.Paragraph>
            <Typography.Text
              link
              onClick={() => {
                navigate(`/messages?course_id=${course.id}`);
              }}
            >
              View all
            </Typography.Text>
          </Space>
        )}
      />
      {sheet}
    </div>
  );
};

export default CourseMessage;
