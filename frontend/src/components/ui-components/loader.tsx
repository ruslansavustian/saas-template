import React from "react";

const Loader = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 text-white "></div>
    </div>
  );
};

export default Loader;
