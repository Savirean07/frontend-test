import { Link } from "react-router-dom";
import { MdSearch, MdLink } from "react-icons/md";

const ScraperToolLinks = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <div className="grow h-px bg-white/10"></div>
        <span className="text-sm text-white/50">Scraper Tools</span>
        <div className="grow h-px bg-white/10"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to="#"
          className="flex items-center gap-2 bg-red-500 hover:bg-red-700/90 transition-all duration-300 p-2 rounded-md group relative grow"
        >
          <span className="bg-red-200 text-black group-hover:text-red-500 p-1 rounded-md group-hover:bg-white transition-all duration-300">
            <MdSearch />
          </span>
          <span className="text-sm text-black  group-hover:text-white transition-all duration-300 grow text-center">
            Web Scraper
          </span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700/90 transition-all duration-300 p-2 rounded-md group relative grow"
        >
          <span className="bg-blue-200 text-black group-hover:text-blue-500 p-1 rounded-md group-hover:bg-white transition-all duration-300">
            <MdLink />
          </span>
          <span className="text-sm text-black  group-hover:text-white transition-all duration-300 grow text-center">
            LinkedIn Profile Scraper
          </span>
        </Link>
      </div>
    </>
  );
};

export default ScraperToolLinks;
