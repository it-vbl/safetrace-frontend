import { useRef, useState } from "react";

import AccessTime from "@/components/atoms/Icons/AccessTime";
import useTouchOutside from "@/helpers/hooks/useTouchOutside";

const TimeRange = ({ value, onChange, isCloseWhenClickOutside = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const generateTimeOptions = () => {
    return Array.from({ length: 48 }, (_, i) => {
      const hours = String(Math.floor(i / 2)).padStart(2, "0");
      const minutes = i % 2 === 0 ? "00" : "30";
      return `${hours}:${minutes}`;
    });
  };

  const timeOptions = generateTimeOptions();

  useTouchOutside(dropdownRef, () => {
    if (isCloseWhenClickOutside) {
      setIsDropdownOpen(false);
    }
  });

  return (
    <div className="relative w-fit">
      <div
        className="flex cursor-pointer items-center rounded-md border px-4"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <input
          type="text"
          value={value}
          placeholder="00:00"
          readOnly
          className="h-[50px] w-full cursor-pointer rounded-md border-dotted border-gray-300 text-center text-lg outline-none focus:ring-0"
        />
        <AccessTime className="ml-2 size-6 text-gray-500" />
      </div>

      {isDropdownOpen && (
        <ul
          className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          ref={dropdownRef}
          data-testid="dropdown"
        >
          {timeOptions.map((time) => (
            <li
              key={time}
              className="cursor-pointer p-2 text-center hover:bg-blue-100"
              onClick={() => {
                onChange(time);
                setIsDropdownOpen(false);
              }}
            >
              {time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeRange;
