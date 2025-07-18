"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Footer() {
  const { isDarkMode } = useDarkMode();

  return (
    <footer className={`py-12 border-t transition-colors duration-300 ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className={`text-2xl font-light transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>SVR.</div>
          <div className="text-right">
            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>design & coding by me</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
