import { Input, Modal } from "@douyinfe/semi-ui";
import { useState } from "react";

const useHostModal = () => {
  const [hostModalVisible, onChangeHostModal] = useState(false);

  const [tempHost, setTempHost] = useState(
    localStorage.getItem("host") ?? undefined
  );

  const hostModal = (
    <Modal
      visible={hostModalVisible}
      onCancel={() => {
        localStorage.removeItem("host");
        onChangeHostModal(false);
      }}
      title="Set development host"
      onOk={() => {
        if (tempHost) {
          localStorage.setItem("host", tempHost);
        }
        window.location.reload();
      }}
    >
      <Input
        placeholder={"Development Host"}
        value={tempHost}
        onChange={setTempHost}
      />
    </Modal>
  );

  return {
    openHostModal: () => onChangeHostModal(true),
    hostModal: hostModal,
  };
};

export default useHostModal;
