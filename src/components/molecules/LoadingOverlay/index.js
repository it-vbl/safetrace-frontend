import { useSelector } from "react-redux";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

const LoadingOverlay = () => {
  const isVisible = useSelector((state) => state.loader.isVisible);

  if (!isVisible) return null;

  return (
    <div className="fixed z-[999] flex h-full w-screen items-center justify-center bg-black bg-opacity-30">
      <div className="spinner-border text-white" role="status">
        <LoadingSpinner size="large" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
