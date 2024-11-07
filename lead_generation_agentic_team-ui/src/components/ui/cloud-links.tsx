import { Link } from "react-router-dom";
import { DiGoogleDrive } from "react-icons/di";
import { BsMicrosoft } from "react-icons/bs";

const CloudLinks = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <div className="grow h-px bg-white/10"></div>
        <span className="text-sm text-white/50">Upload from Cloud</span>
        <div className="grow h-px bg-white/10"></div>
      </div>
      <div className="flex gap-2">
        <Link
          to="#"
          className="flex items-center gap-2 bg-[#21A363] hover:bg-[#21A363]/90 transition-all duration-300 p-2 rounded-md group relative w-full"
        >
          <span className="bg-red-200 text-black group-hover:text-[#21A363] p-1 rounded-md group-hover:bg-white transition-all duration-300">
            <DiGoogleDrive />
          </span>
          <span className="text-sm text-black  group-hover:text-white transition-all duration-300 grow text-center">
            Google Drive
          </span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-2 bg-[#0061FE]/80 hover:bg-[#0061FE] transition-all duration-300 p-2 rounded-md group relative w-full"
        >
          <span className="bg-blue-200 text-black group-hover:text-[#0061FE] p-1 rounded-md group-hover:bg-white transition-all duration-300">
            <BsMicrosoft />
          </span>
          <span className="text-sm text-black  group-hover:text-white transition-all duration-300 grow text-center">
            OneDrive
          </span>
        </Link>
      </div>
    </>
  );
};

export default CloudLinks;
