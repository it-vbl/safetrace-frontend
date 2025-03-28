import { useEffect } from "react";

const useTouchOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownMenu = document.querySelector(
        '[data-testid="dropdown-menu"]',
      );
      const isClickInDropdown = dropdownMenu?.contains(event.target);

      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !isClickInDropdown
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export default useTouchOutside;
