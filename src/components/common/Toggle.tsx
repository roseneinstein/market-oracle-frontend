import React, { useState } from 'react';

interface ToggleProps {
  leftOption: string;
  rightOption: string;
  onChange: (option: string) => void;
  defaultOption?: string;
}

const Toggle: React.FC<ToggleProps> = ({ 
  leftOption, 
  rightOption, 
  onChange,
  defaultOption = leftOption
}) => {
  const [selected, setSelected] = useState(defaultOption);

  const handleToggle = (option: string) => {
    setSelected(option);
    onChange(option);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
      <button
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          selected === leftOption
            ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        onClick={() => handleToggle(leftOption)}
      >
        {leftOption}
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          selected === rightOption
            ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        onClick={() => handleToggle(rightOption)}
      >
        {rightOption}
      </button>
    </div>
  );
};

export default Toggle;