import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState, useRequest } from "ahooks";
import MainService from "@/service";

interface IUserContext {
  token?: string;
  user?: API.User;
  loading: boolean;
  login: (data: { face: string }) => Promise<API.BaseResponse<string>>;
  logout: () => {};
}

const UserContext = createContext<IUserContext>({} as any);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorageState<string | undefined>("token");

  const { runAsync: login, loading: loginLoading } = useRequest(
    MainService.login,
    {
      manual: true,
      onSuccess(data) {
        setToken(data?.data);
      },
    }
  );

  const {
    data: user,
    loading: userLoading,
    mutate: mutateUser,
  } = useRequest(MainService.me, {
    ready: !!token,
    refreshDeps: [token],
  });

  useEffect(() => {
    if (!token) {
      mutateUser(undefined);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user: user?.data,
        token: token,
        loading: loginLoading || userLoading,
        login: login,
        logout: async () => {
          setToken(undefined);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
