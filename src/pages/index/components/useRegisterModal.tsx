import MainService from "@/service";
import { startCamera } from "@/utils/camera";
import {
  Avatar,
  Button,
  Form,
  Modal,
  Progress,
  Space,
  Toast,
  Typography,
} from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";

const useRegisterModal = () => {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStream = useRef<MediaStream>();
  const [step, setStep] = useState(0);
  const [descriptors, setDescriptors] = useState<number[][]>([]);

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
            };
          }
        },
        () => {
          setShowModal(false);
        }
      );
    } else {
      videoStream.current?.getTracks().forEach((track) => track.stop());
      setStep(0);
      setDescriptors([]);
    }
  }, [showModal]);

  const {
    run: startFacialRecognition,
    cancel: stopFacialRecognition,
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
        return await MainService.recognizeFace({
          face: canvas.toDataURL("image/jpeg"),
        });
      }
      throw Error("Camera failed");
    },
    {
      manual: true,
      pollingInterval: -1,
      onSuccess: (data) => {
        setDescriptors((prev) => {
          const d = [...prev, data.data.Descriptor];
          if (d.length >= 50) {
            videoRef.current?.pause();
            videoStream.current?.getTracks().forEach((track) => track.stop());
            stopFacialRecognition();
            setStep(1);
          }
          return d;
        });
      },
    }
  );

  const { run: register, loading: registering } = useRequest(
    MainService.register,
    {
      manual: true,
      onSuccess: () => {
        Toast.success("Successful registration!");
        setShowModal(false);
      },
    }
  );

  const context = (
    <Modal
      title="Registration"
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
      closable={!registering}
    >
      {step == 0 && (
        <Space vertical>
          <Typography.Paragraph>
            Please place your face in the center of the camera. We need 50
            photos of your face to finish the registration.
          </Typography.Paragraph>

          <Typography.Paragraph>
            Once you are ready, you can click the following button to start the
            recognition process.
          </Typography.Paragraph>

          <Avatar size="extra-large">
            <Progress
              percent={descriptors.length * 2}
              type="circle"
              width={136}
              style={{ position: "fixed" }}
            />
            <video
              id="cameraCanvas"
              ref={videoRef}
              style={{ borderRadius: "50%", width: "100%" }}
            />
          </Avatar>

          <Button
            theme="solid"
            disabled={descriptors.length > 0 || recognizing}
            onClick={startFacialRecognition}
          >
            Start Recognition
          </Button>
        </Space>
      )}

      {step == 1 && (
        <Form<{ name: string; email: string }>
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
          labelPosition="inset"
          disabled={registering}
          onSubmit={async (values) => {
            register({
              ...values,
              descriptors: descriptors,
            });
          }}
        >
          <Form.Input
            field="name"
            label="Name"
            placeholder={"Please enter your name"}
            rules={[{ required: true }]}
          />
          <Form.Input
            field="email"
            label="Email"
            placeholder={"Please enter your email"}
            rules={[{ type: "email" }, { required: true }]}
          />
          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            style={{ alignSelf: "flex-end" }}
            loading={registering}
          >
            Register
          </Button>
        </Form>
      )}
    </Modal>
  );

  return { context, showRegisterModal: () => setShowModal(true) };
};

export default useRegisterModal;
