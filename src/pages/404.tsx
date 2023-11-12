import {
  IllustrationNotFound,
  IllustrationNotFoundDark,
} from "@douyinfe/semi-illustrations";
import { Button, Empty, Space } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Empty
      style={{ marginBlock: 120, flex: 1 }}
      image={<IllustrationNotFound style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationNotFoundDark style={{ width: 150, height: 150 }} />
      }
      title={"404 Not Found"}
      description="Requested page not exists!"
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

export default NotFound;
