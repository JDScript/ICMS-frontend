import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorageState, useRequest } from "ahooks";
import MainService from "@/service";

interface IUserContext {
  token?: string;
  user?: API.User;
  loading: boolean;
  login: (data: { face: string }) => Promise<API.BaseResponse<string>>;
  logout: () => {};
  enrolments: API.Enrolment[];
  enrolledInCourse: (courseId: number) => boolean;
  enrolmentsLoading: boolean;
  refreshEnrolments: () => void;
  unreadMessages: API.BasePagination<API.CourseMessage>;
  unreadMessagesLoading: boolean;
  refreshUnreadMessages: () => void;
  readingMessagesLoading: boolean;
  readMessages: (data: { messages_id: number[] }) => void;
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

  const {
    data: enrolments,
    refresh: refreshEnrolments,
    loading: enrolmentsLoading,
  } = useRequest(MainService.getEnrolments, {
    ready: !!user,
    refreshDeps: [user],
    onSuccess: () => {
      refreshUnreadMessages();
    },
  });

  const {
    data: unreadMessages,
    refresh: refreshUnreadMessages,
    loading: unreadMessagesLoading,
  } = useRequest(
    async () => await MainService.getMyMessages({ unread: true, page_size: 5 }),
    {
      ready: !!user,
      refreshDeps: [user],
    }
  );

  const { run: readMessages, loading: readingMessagesLoading } = useRequest(
    MainService.readMessages,
    {
      manual: true,
      onFinally: refreshUnreadMessages,
    }
  );

  const enrolmentsHash = useMemo(() => {
    const hash = new Set<number>();
    enrolments?.data.forEach((e) => hash.add(e.course_id));
    return hash;
  }, [enrolments]);

  const enrolledInCourse = (courseId: number) => enrolmentsHash.has(courseId);

  useEffect(() => {
    if (!token) {
      mutateUser(undefined);
    }
  }, [token]);

  const tokenListener = (e: StorageEvent) => {
    if (e.key === "token") {
      setToken(e.newValue ?? undefined);
    }
  };

  useEffect(() => {
    window.addEventListener("storage", tokenListener);
    return () => {
      window.removeEventListener("storage", tokenListener);
    };
  }, []);

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
        enrolments: enrolments?.data ?? [],
        enrolledInCourse: enrolledInCourse,
        enrolmentsLoading: enrolmentsLoading,
        refreshEnrolments: refreshEnrolments,
        unreadMessages: unreadMessages?.data ?? { list: [], total: 0 },
        unreadMessagesLoading: unreadMessagesLoading,
        refreshUnreadMessages: refreshUnreadMessages,
        readMessages: readMessages,
        readingMessagesLoading: readingMessagesLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
