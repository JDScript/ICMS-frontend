import { useUser } from "@/contexts/user";
import { Descriptions, SideSheet, Typography } from "@douyinfe/semi-ui";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useMessageSheet = () => {
  const [sheetContent, setSheetContent] = useState<API.CourseMessage>();
  const { readMessages } = useUser();

  const sheet = (
    <SideSheet
      title={sheetContent?.title}
      visible={!!sheetContent}
      onCancel={() => setSheetContent(undefined)}
      placement="bottom"
      height={"calc(100% - 60px)"}
      zIndex={1100}
    >
      <Descriptions
        row
        size="small"
        data={[
          {
            key: "Course",
            value: `${sheetContent?.course?.code} - ${sheetContent?.course?.title} [Section, ${sheetContent?.course?.section}, ${sheetContent?.course?.year}]`,
          },
          {
            key: "Sent by",
            value: sheetContent?.sender?.name,
          },
          {
            key: "Published at",
            value: dayjs
              .tz(sheetContent?.created_at)
              .format("YYYY-MM-DD HH:mm:ss Z"),
          },
          {
            key: "Updated at",
            value: dayjs
              .tz(sheetContent?.updated_at)
              .format("YYYY-MM-DD HH:mm:ss Z"),
          },
        ]}
      />
      <Typography.Paragraph style={{ marginBlock: 12 }}>
        <span
          dangerouslySetInnerHTML={{ __html: sheetContent?.content ?? "" }}
        />
      </Typography.Paragraph>
    </SideSheet>
  );

  useEffect(() => {
    if (sheetContent && !sheetContent.read_at) {
      readMessages({ messages_id: [sheetContent.id] });
    }
  }, [sheetContent]);

  return {
    sheet,
    openMsg: (msg: API.CourseMessage) => setSheetContent(msg),
  };
};

export default useMessageSheet;
