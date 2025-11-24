import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
    </div>
  );
};

export default Loader;
