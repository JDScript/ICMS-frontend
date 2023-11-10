import { Button, Empty, Space } from "@douyinfe/semi-ui";
import {
  IllustrationNoAccess,
  IllustrationNoAccessDark,
} from "@douyinfe/semi-illustrations";
import useLoginModal from "./components/useLoginModal";
import useRegisterModal from "./components/useRegisterModal";
import { useUser } from "@/contexts/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const IndexPage = () => {
  const { context: loginModalHolder, showLoginModal } = useLoginModal();
  const { context: registerModalHolder, showRegisterModal } =
    useRegisterModal();

  const { token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  return (
    <Empty
      style={{ marginBlock: 120, flex: 1 }}
      image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationNoAccessDark style={{ width: 150, height: 150 }} />
      }
      title={"No Access!"}
      description="Please login to continue..."
    >
      <Space>
        <Button onClick={showLoginModal}>Facial Login</Button>
        <Button onClick={showRegisterModal}>Register</Button>
      </Space>

      {loginModalHolder}
      {registerModalHolder}
    </Empty>
  );
};

export default IndexPage;
