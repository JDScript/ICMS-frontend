import { useUser } from "@/contexts/user";
import { SideSheet, Typography } from "@douyinfe/semi-ui";
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
      <Typography.Paragraph>
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
