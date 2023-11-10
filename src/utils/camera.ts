import { Toast } from "@douyinfe/semi-ui";

export const startCamera = (
  successCallback: (stream: MediaStream) => void,
  errorCallback: () => void
) => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: 512,
        height: 512,
      },
    })
    .then(successCallback)
    .catch((reason) => {
      if (reason instanceof Error) {
        Toast.error("Cannot open camera: " + reason.message);
      } else {
        Toast.error("Cannot open camera: Unknown error");
      }
      errorCallback();
    });
};