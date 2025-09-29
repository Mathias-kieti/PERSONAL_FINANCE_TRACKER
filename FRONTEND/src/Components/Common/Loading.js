import React from 'react';
import { DollarSign } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-bounce mb-4">
          <div className="bg-blue-600 p-4 rounded-full">
            <DollarSign size={48} className="text-white" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        <p className="text-gray-600">Please wait while we fetch your data</p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;