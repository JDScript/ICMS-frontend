import { useUser } from "@/contexts/user";
import { startCamera } from "@/utils/camera";
import { Modal, Space, Spin, Typography, Avatar } from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";

const useLoginModal = () => {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { login, loading } = useUser();
  const videoStream = useRef<MediaStream>();

  useEffect(() => {
    if (showModal) {
      startCamera(
        (stream) => {
          videoStream.current = stream;
          const video = videoRef.current;
          if (video != null) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
              startFacialRecognitionLogin();
            };
          }
        },
        () => {
          setShowModal(false);
        }
      );
    } else {
      videoStream.current?.getTracks().forEach((track) => track.stop());
    }
  }, [showModal]);

  const {
    run: startFacialRecognitionLogin,
    cancel: stopFacialRecognitionLogin,
    error,
    loading: recognizing,
  } = useRequest(
    async () => {
      const video = videoRef.current;
      if (video != null && video?.played.length > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        return await login({ face: canvas.toDataURL("image/jpeg") });
      }
    },
    {
      manual: true,
      pollingInterval: -1,
      onSuccess: (data) => {
        if (data?.data) {
          videoRef.current?.pause();
          videoStream.current?.getTracks().forEach((track) => track.stop());
          stopFacialRecognitionLogin();
        }
      },
    }
  );

  const context = (
    <Modal
      title="Facial Login"
      visible={showModal}
      onCancel={() => setShowModal(false)}
      style={{ maxWidth: "100%" }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 16,
      }}
      footer={null}
      maskClosable={false}
    >
      <Space vertical>
        <Typography.Text>
          Please place your face in the center of the camera.
        </Typography.Text>

        <Avatar size="extra-large">
          {(recognizing || loading) && (
            <Spin spinning={recognizing} style={{ position: "absolute" }} />
          )}
          <video
            id="cameraCanvas"
            ref={videoRef}
            style={{ borderRadius: "50%", width: "100%" }}
          />
        </Avatar>

        {recognizing && (
          <Typography.Text strong>Recognizing...</Typography.Text>
        )}

        <Typography.Text type="danger" strong>
          {error?.message}
        </Typography.Text>
      </Space>
    </Modal>
  );

  return { context, showLoginModal: () => setShowModal(true) };
};

export default useLoginModal;
