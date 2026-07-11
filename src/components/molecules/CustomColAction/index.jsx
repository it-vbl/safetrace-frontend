import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Tridots from "@/components/atoms/Icons/Tridots";

import Action from "../Action";

const CustomColAction = ({ params, actions }) => {
  const modalRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [domReady, setDomReady] = useState(false);
  const [location, setLocation] = useState({
    left: 0,
    top: 0,
  });

  const handleOnClickAction = (e) => {
    const modalLocation = e.target.getBoundingClientRect();
    setLocation(modalLocation);
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setDomReady(true);

    const handleClickOutside = (event) => {
      if (modalRef?.current && !modalRef?.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    isMenuOpen && window.addEventListener("scroll", handleOnClickAction, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleOnClickAction, true);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <Tridots
        data-testid="tridots-icon"
        className="cursor-pointer"
        id={"table-row-" + params.data.no}
        onClick={handleOnClickAction}
      />
      {isMenuOpen && domReady
        ? createPortal(
            <div
              data-testid={"table-action-" + params.data.no}
              id={"table-action-" + params.data.no}
              style={{ left: location.left, top: location.top }}
              className="bg-primary5 absolute top-9 -translate-x-full translate-y-4 rounded-md border-neutral-200 bg-white p-1 shadow-sm"
              ref={modalRef}
            >
              {actions?.map((item, index) => (
                <Action
                  data-testid={`action-${index}`}
                  icon={item.icon}
                  label={item.label}
                  className={item.className}
                  onClick={() => item.onClick(params.data)}
                  key={index}
                  disabled={item.disabled}
                />
              ))}
            </div>,
            document.getElementById("__next"),
          )
        : null}
    </div>
  );
};

export default CustomColAction;
