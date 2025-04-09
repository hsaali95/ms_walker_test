import { toast, TypeOptions } from "react-toastify";
export const Toaster = (type: TypeOptions, message: string) => {
  return toast(message, {
    type: type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: Math.floor(Math.random() * 100),
  });
};

export const showLoadingToast = (message: string) => {
  const toastId = toast.loading(message, {
    position: "top-right",
    theme: "colored",
  });
  return toastId;
};

export const updateToast = (
  toastId: string | number,
  message: string,
  type: "success" | "error" = "success",
  autoClose: number = 3000
) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: autoClose,
  });
};

export const deleteToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
