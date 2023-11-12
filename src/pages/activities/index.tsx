import { useUser } from "@/contexts/user";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import {
  Button,
  Descriptions,
  Layout,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "@douyinfe/semi-ui";
import type { TagProps } from "@douyinfe/semi-ui/lib/es/tag";
import { usePagination, useRequest } from "ahooks";
import dayjs from "dayjs";

const REQUEST_METHOD_MAP: { [key: string]: TagProps["color"] } = {
  GET: "green",
  POST: "orange",
  PATCH: "indigo",
  PUT: "blue",
  DELETE: "red",
};

const ActivitiesPage = () => {
  const { user } = useUser();
  const { data, pagination, loading, refresh } = usePagination(
    async ({ current, pageSize }) => {
      return extractData(
        MainService.getMyActivities({
          page: current,
          page_size: pageSize,
        })
      );
    },
    {
      debounceWait: 500,
    }
  );

  const { runAsync: clearMyActivities, loading: clearingMyActivities } =
    useRequest(MainService.clearMyActivities, {
      manual: true,
      onSuccess: refresh,
    });

  return (
    <Layout.Content style={{ padding: 24, width: "100%", overflow: "hidden" }}>
      <Typography.Title>
        ⏱️ Here are your activities in the system, {user?.name}!
      </Typography.Title>
      <Descriptions
        style={{ marginBlock: 12 }}
        size="small"
        row={true}
        data={[
          {
            key: "Current login",
            value: (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {user?.current_login_at
                  ? dayjs(user.current_login_at * 1000).format(
                      " YYYY-MM-DD HH:mm:ss Z"
                    )
                  : " Never"}
              </span>
            ),
          },
          {
            key: "Last login",
            value: (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {user?.last_login_at
                  ? dayjs(user.last_login_at * 1000).format(
                      " YYYY-MM-DD HH:mm:ss Z"
                    )
                  : " Never"}
              </span>
            ),
          },
          {
            key: "Last activity",
            value: (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {user?.last_activity_at
                  ? dayjs(user.last_activity_at * 1000).format(
                      " YYYY-MM-DD HH:mm:ss Z"
                    )
                  : " Never"}
              </span>
            ),
          },
        ]}
      />
      <div style={{ textAlign: "right", marginBlock: 12 }}>
        <Popconfirm
          title="Are you sure to clear all your activities?"
          content="This action cannot be undone!"
          onConfirm={clearMyActivities}
        >
          <Button loading={clearingMyActivities} type="danger">
            Clear my activities
          </Button>
        </Popconfirm>
      </div>
      <div style={{ overflowX: "scroll" }}>
        <div style={{ minWidth: 1200 }}>
          <Table
            rowKey={"id"}
            size="small"
            dataSource={data?.list}
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
            loading={loading}
            columns={[
              { dataIndex: "id", title: "ID", width: 100 },
              { dataIndex: "type", title: "Type", width: 200 },
              {
                dataIndex: "method",
                title: "Method",
                render: (_, act) => (
                  <Tag color={REQUEST_METHOD_MAP[act.method]}>{act.method}</Tag>
                ),
                width: 100,
              },
              {
                dataIndex: "path",
                title: "Path",
                ellipsis: { showTitle: false },
                render: (text) => (
                  <Typography.Text ellipsis={{ showTooltip: true }}>
                    {text}
                  </Typography.Text>
                ),
              },
              {
                dataIndex: "header",
                title: "Header",
                ellipsis: { showTitle: false },
                render: (text) => (
                  <Typography.Text ellipsis={{ showTooltip: true }}>
                    {JSON.stringify(text)}
                  </Typography.Text>
                ),
              },
              { dataIndex: "src_ip", title: "Source IP" },
              {
                dataIndex: "created_at",
                title: "Record Time",
                render: (_, act) => (
                  <span style={{ fontVariant: "tabular-nums" }}>
                    {dayjs(act.created_at * 1000).format(
                      "YYYY-MM-DD HH:mm:ss Z"
                    )}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Layout.Content>
  );
};

export default ActivitiesPage;
