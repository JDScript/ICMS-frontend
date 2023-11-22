import { useUser } from "@/contexts/user";
import MainService from "@/service";
import { extractData } from "@/utils/extractData";
import useUrlState from "@ahooksjs/use-url-state";
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

const ACTIVITIES_MAP = [
  "register",
  "login",
  "get_my_profile",
  "get_my_activities",
  "clear_my_activities",
  "get_my_enrolments",
  "create_my_enrolment",
  "get_my_messages",
  "read_my_messages",
  "search_all_courses",
  "get_course_detail",
  "send_course_detail",
  "get_course_sections",
  "get_course_messages",
];

const ActivitiesPage = () => {
  const { user } = useUser();

  const [filter, setFilter] = useUrlState<{
    method?: string[];
    type?: string[];
  }>({
    method: undefined,
    type: undefined,
  });

  const { data, pagination, loading, refresh } = usePagination(
    async ({ current, pageSize }) => {
      return extractData(
        MainService.getMyActivities({
          page: current,
          page_size: pageSize,
          type: filter.type
            ? filter.type instanceof Array
              ? filter.type
              : [filter.type]
            : undefined,
          method: filter.method
            ? filter.method instanceof Array
              ? filter.method
              : [filter.method]
            : undefined,
        })
      );
    },
    {
      debounceWait: 500,
      refreshDeps: [filter],
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
                  ? dayjs(user.current_login_at).format(
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
                  ? dayjs(user.last_login_at).format(" YYYY-MM-DD HH:mm:ss Z")
                  : " Never"}
              </span>
            ),
          },
          {
            key: "Last activity",
            value: (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {user?.last_activity_at
                  ? dayjs(user.last_activity_at).format(
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
            onChange={({ filters = [] }) => {
              const newFilter: { [key: string]: string[] } = {};

              for (const f of filters) {
                if (f.dataIndex == "method" && f.filteredValue) {
                  newFilter["method"] = f.filteredValue;
                }

                if (f.dataIndex == "type" && f.filteredValue) {
                  newFilter["type"] = f.filteredValue;
                }
              }

              setFilter(newFilter);
            }}
            loading={loading}
            columns={[
              { dataIndex: "id", title: "ID", width: 100 },
              {
                dataIndex: "type",
                title: "Type",
                filters: ACTIVITIES_MAP.map((a) => ({ text: a, value: a })),
                width: 200,
                filteredValue: filter.type
                  ? filter.type instanceof Array
                    ? filter.type
                    : [filter.type]
                  : undefined,
              },
              {
                dataIndex: "method",
                title: "Method",
                filters: ["GET", "POST", "PATCH", "PUT", "DELETE"].map(
                  (method) => ({
                    value: method.toLowerCase(),
                    text: (
                      <Tag color={REQUEST_METHOD_MAP[method]}>{method}</Tag>
                    ),
                  })
                ),
                filteredValue: filter.method
                  ? filter.method instanceof Array
                    ? filter.method
                    : [filter.method]
                  : undefined,
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
                    {dayjs(act.created_at).format("YYYY-MM-DD HH:mm:ss Z")}
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
