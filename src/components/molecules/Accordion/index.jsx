import { useState } from 'react';

import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';

const Accordion = ({
  title = '',
  children = <></>,
  defaultIsOpen = false,
  prefixComponent = <></>,
  prefixTitleComponent = <></>,
}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  return (
    <div className="w-full border border-gray-300 bg-white">
      <div
        className="flex w-full cursor-pointer flex-row items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div onClick={(e) => e.stopPropagation()}>{prefixComponent}</div>
        <div className="flex flex-1 items-center text-[14px] font-bold uppercase tracking-[1px]">
          {title} {prefixTitleComponent}
        </div>
        {isOpen ? <MinusIcon width={16} /> : <PlusIcon width={16} />}
      </div>
      {isOpen ? <div className=" px-4 pb-4">{children}</div> : null}
    </div>
  );
};

export default Accordion;
