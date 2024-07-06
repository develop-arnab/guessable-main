/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToastContent = ({ message, closeToast }) => (
  <div className="flex justify-between items-center gap-2">
    <div>{message}</div>
    <button
      onClick={closeToast}
      className=" rounded-full  border-secondary hover:border-white text-white hover:text-white h-[40px] py-2 px-4 text-sm md:text-base flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap min-w-[60px] max-w-[60px]"
    >
      OK
    </button>
  </div>
);

export const Notification = (message, type = "default") => {
  const toastOptions = {
    position: "top-center",
    autoClose: 100,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { backgroundColor: "#2f3033", color: "white" },
    closeButton: false,
  };

  const renderToast = () => (
    <CustomToastContent
      closeButton={false}
      message={message}
      closeToast={() => toast.dismiss()}
    />
  );

  switch (type) {
    case "success":
      return toast.success(renderToast, toastOptions);
    case "error":
      return toast.error(renderToast, toastOptions);
    case "info":
      return toast.info(renderToast, toastOptions);
    case "warn":
      return toast.warn(renderToast, toastOptions);
    default:
      return toast(renderToast, toastOptions);
  }
};
