import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex w-full min-h-dvh items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
