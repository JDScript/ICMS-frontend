import useMessageSheet from "@/components/useMessageSheet";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";
import {
  Empty,
  Layout,
  Radio,
  RadioGroup,
  Table,
  Typography,
} from "@douyinfe/semi-ui";
import { usePagination } from "ahooks";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const [msgFilter, setMsgFilter] = useState<"all" | "unread">("all");
  const {
    data: messages,
    loading,
    pagination,
  } = usePagination(
    async ({ current, pageSize }) =>
      extractData(
        MainService.getMyMessages({
          page: current,
          page_size: pageSize,
          unread: msgFilter == "unread",
        })
      ),
    {
      refreshDeps: [msgFilter],
    }
  );
  const navigate = useNavigate();
  const { sheet, openMsg } = useMessageSheet();

  return (
    <Layout.Content style={{ padding: 24, overflow: "hidden" }}>
      <Typography.Title>📨 Time to check for your messages?</Typography.Title>
      <RadioGroup
        type="button"
        style={{ marginBlock: 12 }}
        value={msgFilter}
        onChange={(e) => setMsgFilter(e.target.value)}
      >
        <Radio value={"all"}>All</Radio>
        <Radio value={"unread"}>Unread</Radio>
      </RadioGroup>
      <div style={{ overflowX: "scroll" }}>
        <div style={{ minWidth: 1000 }}>
          <Table
            size="small"
            dataSource={messages?.list}
            loading={loading}
            pagination={{
              currentPage: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showTotal: true,
              showSizeChanger: false,
              onChange(currentPage, pageSize) {
                pagination.onChange(currentPage, pageSize);
              },
            }}
            columns={[
              {
                dataIndex: "title",
                title: "Title",
                render: (_, record) => (
                  <Typography.Text
                    link
                    ellipsis={{ showTooltip: true }}
                    onClick={() => openMsg(record)}
                  >
                    {record.title}
                  </Typography.Text>
                ),
              },
              {
                dataIndex: "course",
                title: "Course",
                render: (_, record) => (
                  <Typography.Text
                    link
                    onClick={() => navigate(`/courses/${record.course_id}`)}
                  >
                    {record.course?.code}
                  </Typography.Text>
                ),
                width: 100,
              },
              {
                dataIndex: "created_at",
                title: "Published at",
                render: (t) => (
                  <span style={{ fontVariant: "tabular-nums" }}>
                    {dayjs(t).format("YYYY-MM-DD HH:mm:ss Z")}
                  </span>
                ),
              },

              {
                dataIndex: "updated_at",
                title: "Updated at",
                render: (t) => (
                  <span style={{ fontVariant: "tabular-nums" }}>
                    {dayjs(t).format("YYYY-MM-DD HH:mm:ss Z")}
                  </span>
                ),
              },
            ]}
            empty={
              <Empty
                image={<IllustrationNoResult width={120} height={120} />}
                darkModeImage={
                  <IllustrationNoResultDark width={120} height={120} />
                }
                description="No messages!"
              />
            }
          />
        </div>
      </div>
      {sheet}
    </Layout.Content>
  );
};

export default MessagesPage;
