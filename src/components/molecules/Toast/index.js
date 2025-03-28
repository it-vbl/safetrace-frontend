import PropTypes from "prop-types";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Checklist from "@/components/atoms/Icons/Checklist";
import Close from "@/components/atoms/Icons/Close";
import Warning from "@/components/atoms/Icons/Warning";

import tailwindConfig from "../../../../tailwind.config";

const CloseButton = ({ closeToast }) => (
  <div className="flex items-center">
    <button className="cursor-pointer" onClick={closeToast}>
      <Close />
    </button>
  </div>
);

const Toast = ({
  show,
  message,
  toastId,
  type,
  autoClose,
  showCloseButton,
  setToast,
}) => {
  const render = {
    success: {
      icon: <Checklist />,
      backgroundColor: tailwindConfig?.theme?.extend?.colors?.green1,
    },
    error: {
      icon: <Warning />,
      backgroundColor: tailwindConfig?.theme?.extend?.colors?.error1,
    },
  };

  useEffect(() => {
    if (show) {
      toast(message, {
        containerId: toastId,
        type,
        icon: render[type]?.icon,
        autoClose,
        style: {
          backgroundColor: render[type]?.backgroundColor,
          color: tailwindConfig?.theme?.extend?.colors?.neutral10,
          fontWeight: 600,
          fontSize: 14,
        },
        closeButton: showCloseButton ? CloseButton : false,
        closeOnClick: true,
        draggable: false,
        toastId,
      });
      setToast(false);
    }
  }, [show]);

  return <ToastContainer containerId={toastId} />;
};

Toast.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
  toastId: PropTypes.string,
  type: PropTypes.oneOf(["success", "error"]),
  autoClose: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  setToast: PropTypes.func,
};
Toast.defaultProps = {
  type: "success",
  showCloseButton: true,
  setToast: () => {},
  autoClose: true,
};
CloseButton.propTypes = {
  closeToast: PropTypes.func,
};

export default Toast;
