import { useState } from 'react';
import { CustomSelectProps } from '@/types/custom';
import { motion } from 'framer-motion';

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string | number) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative mobile:w-[157px]`}>
      <div
        className={`px-4 py-2 h-12 w-[250px] border border-Grey-300 rounded-md cursor-pointer bg-white flex items-center justify-between
                    mobile:w-[157px]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-Grey-300">{value || '시즌 선택'}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 right-0 mt-1 bg-white border border-Grey-300 rounded-md shadow-lg z-30 overflow-y-auto"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default CustomSelect;
