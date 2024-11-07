import { useState } from "react";
import {
  MdError,
  MdFilePresent,
  MdFolder,
  MdFolderOff,
  MdFolderOpen,
} from "react-icons/md";

const FolderStructure = ({ data, count }: { data: any; count: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const keys = Object.keys(data);
  if (!isOpen) {
    return (
      <span onClick={toggleOpen}>
        <MdFolderOpen /> {count}
      </span>
    );
  }

  if (!data)
    return (
      <p className="text-sm text-red-500 ml-6 flex items-center gap-2">
        <span className="text-red-500 w-fit">
          <MdError />
        </span>{" "}
        No data
      </p>
    );
  if (count >= 9) {
    return JSON.stringify(data, null, 2);
  }
  if (typeof data !== "object") {
    if (Array.isArray(data)) {
      return data.map((item) => (
        <FolderStructure data={item} count={count + 1} />
      ));
    } else if (typeof data === "string") {
      return (
        <span className="text-sm text-gray-500 ml-6 flex items-center gap-2">
          <span className="text-gray-500 w-fit self-start">
            <MdFilePresent />
          </span>{" "}
          {data}
        </span>
      );
    }
  }

  return (
    <li className="flex flex-col gap-2 ml-4">
      {keys.map((key) => {
        
        if (data[key] && isOpen) {
          return (
            <>
              <span className="text-sm flex items-center gap-2">
                {isOpen ? <MdFolderOpen /> : <MdFolder />} {key}
              </span>
              <FolderStructure data={data[key]} count={count + 1} />
            </>
          );
        } else {
          return (
            <span className="text-sm flex items-center gap-2">
              <span className="text-gray-500 w-fit" onClick={toggleOpen}>
                <MdFolderOff />
              </span>
              {key}
            </span>
          );
        }
      })}
    </li>
  );
};

export default FolderStructure;
