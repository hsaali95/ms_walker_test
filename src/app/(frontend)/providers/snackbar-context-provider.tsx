import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ToasterProvider = () => {
  return (
    <ToastContainer
      position={"top-left"}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      className={"!z-[99999]"}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={"colored"}
    />
  );
};
