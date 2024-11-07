import { PiSpinner } from "react-icons/pi";

export const AuthOverlay = () => {
  return (
    <div className="w-full h-full bg-black-900/70 backdrop-blur-md absolute z-50 flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-4 max-w-lg w-full border border-black-700 rounded-lg">
        <h1 className="text-white font-cascade border-b border-black-700 py-2 w-full text-center">
          Popup Window for Authentication
        </h1>
        <div className="flex flex-col items-center justify-center gap-2 w-full h-60">
          <PiSpinner className="text-white animate-spin text-4xl" />
          <p className="text-white text-center">
            Please wait while we authenticate you...
          </p>
          <p className="text-black-500 text-center text-sm ">
            Popup window is being used to authenticate you. Please check your
            browser settings if you are not redirected automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
