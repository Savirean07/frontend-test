/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const PopUp = ({ windowTitle, handleCloseSocialMediaWindow, children }) => {
  const dialogElement = useRef(null);
  const handleClickOutside = (e) => {
    if (e.relatedTarget === null) {
      handleCloseSocialMediaWindow(e);
    }
  };
  useEffect(() => {
    if (dialogElement.current) {
      dialogElement.current.focus();
      document.onkeyup = (e) => {
        if (e.key === "Escape") {
          handleCloseSocialMediaWindow(e);
        }
      };
    }
  }, []);

  return (
    <div className="absolute animate-fade-in bg-white/10 backdrop-blur rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
      <div
        ref={dialogElement}
        onBlur={handleClickOutside}
        tabIndex={1}
        className="w-96 animate-slide-up text-black rounded-lg shadow-2xl shadow-black-900 relative"
      >
        <div className="h-10 bg-black-900 rounded-t-lg text-white font-cascade flex items-center justify-center relative">
          <h3 className="my-auto">{windowTitle || "Share on social media"}</h3>
          <button
            onClick={handleCloseSocialMediaWindow}
            className="absolute right-2 top-2 text-white"
          >
            <IoClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default PopUp;
