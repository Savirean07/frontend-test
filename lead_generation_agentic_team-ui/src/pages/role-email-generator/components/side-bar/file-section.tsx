import { useEffect, useState } from "react";
import { BsFileEarmarkX } from "react-icons/bs";
import { MdAdd, MdFileOpen, MdRefresh } from "react-icons/md";
import { VscJson, VscTable } from "react-icons/vsc";
import { apiCallStatus } from "src/utils";
import { BiLoader } from "react-icons/bi";
import { generateUUID } from "src/utils/crypto";
import helperFunctions from "src/auth/helper";
import { useMsal } from "src/auth";
import { IconButton } from "src/components/ui";
import { URIs } from "src/config";

type FileData = {
  id?: string | number;
  name?: string;
  data?: any;
  status?: string;
  hidden?: boolean;
  showAddButton?: boolean;
};

const fileCache = new Map<string, FileData[]>();

const FileSection = ({
  hidden,
  showAddButton,
  onOpenFile,
  onDataChange,
}: {
  hidden?: boolean;
  showAddButton?: boolean;
  onOpenFile?: (file: FileData) => void;
  onAddFile?: () => void;
  onDataChange?: (data: FileData[]) => void;
}) => {
  const { msalInstance } = useMsal();
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleFetchJsonDataFile = async () => {
    const url = `${URIs.API_URL}/file/all`;
    const cachedFiles = fileCache.get(url);
    if (cachedFiles) {
      setFiles(cachedFiles);
    }
    try {
      setIsLoading(true);
      const { getToken, getPolicy } = helperFunctions(msalInstance);
      const token = await getToken();
      const policy = getPolicy();
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          policy: policy || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const fileNames = data.map((file: string) => ({
          id: generateUUID(),
          name: file,
        }));
        fileCache.set(url, fileNames);
        setFiles(fileNames);
      } else {
        throw new Error("Failed to fetch file names");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchJsonDataFile();
  }, []);

  useEffect(() => {
    onDataChange && onDataChange(files);
    return () => {
      fileCache.clear();
    }
  }, [files]);

  if (hidden) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 ">
      <p className="text-sm w-full flex flex-row items-center uppercase px-4">
        <span className="grow">Available Data files</span>
        {showAddButton && (
          <>
            <button className="text-green-500 bg-green-500/20 p-1 rounded-md flex flex-row items-center group mr-2">
              <MdAdd size={16} />
              <span className="text-xs w-0 group-hover:w-6 overflow-hidden transition-all duration-300">
                Add
              </span>
            </button>
          </>
        )}
        <IconButton
          icon={
            <MdRefresh
              size={14}
              className={`${isLoading ? "animate-spin" : ""}`}
            />
          }
          onClick={handleFetchJsonDataFile}
          title="Reload"
          text="Reload"
        />
      </p>
      <ul className="px-4 gap-1 flex flex-col">
        {files &&
          files.map((file) => (
            <FileListSkeleton
              key={file.id}
              file={file}
              type="csv"
              onOpen={() => {
                onOpenFile &&
                  onOpenFile({
                    ...file,
                  });
              }}
            />
          ))}
      </ul>
      {files.length === 0 && (
        <div className="h-32 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <BsFileEarmarkX size={16} className="text-gray-500" />
            <span className="text-gray-500">No files available</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface FileListSkeletonProps {
  file: FileData;
  type: string;
  onOpen: (data: any, type: string) => void;
}

const FileListSkeleton = ({ file, type, onOpen }: FileListSkeletonProps) => {
  const { status } = file;

  if (status === apiCallStatus.IN_PROGRESS) {
    return (
      <li
        key={file.id}
        className="flex flex-row items-center gap-2 text-sm group hover:bg-green-500/20 hover:py-2 px-2 rounded-md"
      >
        <span className="text-gray-500 bg-gray-500/20 p-1 rounded-md">
          <BiLoader className="animate-spin" size={16} />
        </span>
      </li>
    );
  }

  if (status === apiCallStatus.ERROR) {
    return (
      <li
        key={file.id}
        className="flex flex-row items-center gap-2 text-sm group hover:bg-red-500/20 hover:py-2 px-2 rounded-md"
      >
        <span className="text-red-500 bg-red-500/20 p-1 rounded-md">
          {type === "csv" ? <VscTable /> : <VscJson />}
        </span>
        <span className="text-gray-500 group-hover:text-red-500 grow">
          {type} not found
        </span>
      </li>
    );
  }

  return (
    <li
      key={file.id}
      className="flex flex-row items-center gap-2 text-sm group hover:bg-green-500/20 hover:py-2 px-2 rounded-md"
    >
      <span className="text-green-500 bg-green-500/20 p-1 rounded-md">
        {type === "csv" ? <VscTable /> : <VscJson />}
      </span>
      <span className="text-gray-500 group-hover:text-green-500 grow">
        {file.name}
      </span>
      <span className="text-gray-500 group-hover:text-green-500 hidden group-hover:block self-center">
        <button
          onClick={() => {
            onOpen(file.data, type);
          }}
          className="p-1 rounded-md hover:bg-green-500/20 flex items-center group/btn"
        >
          <MdFileOpen size={16} />
          <span className="w-0 group-hover/btn:w-7 text-xs overflow-hidden transition-all duration-300">
            Open
          </span>
        </button>
      </span>
    </li>
  );
};

export default FileSection;
