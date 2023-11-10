export const extractData = async <T>(
  req: Promise<API.BaseResponse<API.BasePagination<T>>>
): Promise<API.BasePagination<T>> => {
  const data = await req;
  return data.data;
};
