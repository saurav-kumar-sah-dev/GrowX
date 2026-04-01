import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import NotFoundImage from '../assets/notfound.jpg'; // 👈 adjust path if using local image

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <img
        src={NotFoundImage}
        alt="404 Not Found"
        className="w-60 md:w-80 mb-6"
      />
      <h1 className="text-4xl md:text-5xl font-bold text-[#6A38C2] mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6 text-sm md:text-base">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')} className="bg-[#6A38C2] text-white px-6 py-2 rounded-full">
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
