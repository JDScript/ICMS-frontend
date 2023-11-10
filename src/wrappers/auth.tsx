import Loading from "@/components/Loading";
import { useUser } from "@/contexts/user";
import { Empty } from "@douyinfe/semi-ui";
import { useEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import {
  IllustrationNoAccess,
  IllustrationNoAccessDark,
} from "@douyinfe/semi-illustrations";

const AuthWrapper = () => {
  const outlet = useOutlet();
  const { user, token, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [user, token, loading]);

  if (!token) {
    return (
      <Empty
        style={{ marginBlock: 120, flex: 1 }}
        image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
        darkModeImage={
          <IllustrationNoAccessDark style={{ width: 150, height: 150 }} />
        }
        title={"No Access!"}
      />
    );
  }

  if (loading || !user) {
    return <Loading />;
  }

  return outlet;
};

export default AuthWrapper;
