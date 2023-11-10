import { Spin } from "@douyinfe/semi-ui";

const Loading = () => {
  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Spin style={{ marginBlock: 24 }} />
    </div>
  );
};

export default Loading;
