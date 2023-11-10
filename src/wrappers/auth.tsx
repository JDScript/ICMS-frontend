import Loading from "@/components/Loading";
import { useUser } from "@/contexts/user";
import { useNavigate, useOutlet } from "react-router-dom";

const AuthWrapper = () => {
  const outlet = useOutlet();
  const { user, token, loading } = useUser();
  const navigate = useNavigate();

  if (!token) {
    navigate("/");
    return <></>;
  }

  if (loading || !user) {
    return <Loading />;
  }

  return outlet;
};

export default AuthWrapper;
