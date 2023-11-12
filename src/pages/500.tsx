import {
  IllustrationFailure,
  IllustrationFailureDark,
} from "@douyinfe/semi-illustrations";
import { Button, Empty, Space } from "@douyinfe/semi-ui";
import { useNavigate, useRouteError } from "react-router-dom";

const InternalServerError = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;
  return (
    <Empty
      style={{ marginBlock: 120, flex: 1 }}
      image={<IllustrationFailure style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationFailureDark style={{ width: 150, height: 150 }} />
      }
      title={error.name}
      description={error.message}
    >
      <Space
        style={{ width: "100%", flexDirection: "column", display: "flex" }}
        align="center"
      >
        <Button onClick={() => navigate("/dashboard", { replace: true })}>
          Dashboard
        </Button>
      </Space>
    </Empty>
  );
};

export default InternalServerError;
