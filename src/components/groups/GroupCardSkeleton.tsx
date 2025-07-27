function GroupCardSkeletion() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-3 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupCardSkeletion;
