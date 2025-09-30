export default function SkeletonProductTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>

      {/* Скелетон рядків */}
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Фото */}
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>

            {/* Назва */}
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Тип */}
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>

            {/* Ціна */}
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>

            {/* Статус */}
            <div className="h-6 bg-gray-200 rounded-full w-12 animate-pulse"></div>

            {/* Дата */}
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>

            {/* Дії */}
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
