const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-red-500 text-center">
        <p className="text-lg font-medium">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
