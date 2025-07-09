import { Icon } from "@iconify/react";

const Loading = () => {
  return (
    <div className="flex w-full h-full items-center animate-spin justify-center">
      <Icon icon={"mingcute:loading"} className="h-14 w-14" />
    </div>
  );
};

export default Loading;
