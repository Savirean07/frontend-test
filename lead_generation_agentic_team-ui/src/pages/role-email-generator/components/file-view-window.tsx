import { useEffect, useState } from "react";
import { MdError, MdErrorOutline, MdFilePresent } from "react-icons/md";
import Table, { getTheme, TableProps } from "src/components/ui/table";
import { csvToJson, jsonToCsv } from "src/utils";
import { IconButton, Modal, WindowHeaderBar } from "src/components/ui";
import { BiLoader } from "react-icons/bi";
import helperFunctions from "src/auth/helper";
import { useMsal } from "src/auth";
import { twMerge } from "tailwind-merge";
import { URIs } from "src/config";

export type TFileData = {
  id?: string;
  name?: string;
  data?: Record<string, string>[] | null;
};

type IFileViewWindow = {
  fileObject?: TFileData;
  onClose?: () => void;
  className?: string;
  themeColor?: TableProps["themeColor"];
};

const cacheFileData = new Map<string, Record<string, string>[]>();

const FileViewWindow = ({
  fileObject,
  onClose,
  className,
  themeColor,
}: IFileViewWindow) => {
  const { msalInstance } = useMsal();
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFullData, setShowFullData] = useState(false);
  const [fileData, setFileData] = useState<Record<string, string>[] | null>(
    null
  );

  const [selectedData, setSelectedData] = useState<Record<string, string>[]>(
    []
  );

  const theme = getTheme(themeColor || "purple");

  const downloadFile = (type: "csv" | "json") => {
    const fileContent =
      type === "csv" ? jsonToCsv(fileData) : JSON.stringify(fileData);
    const blob = new Blob([fileContent], {
      type: type === "csv" ? "text/csv" : "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data.${type}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadFile = async (url: string) => {
    setIsDownloading(true);
    const fileData = cacheFileData.get(url);
    if (fileData) {
      setFileData(fileData);
      setIsDownloading(false);
    }
    try {
      const { getToken, getPolicy } = helperFunctions(msalInstance);
      const token = await getToken();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          policy: getPolicy() || "",
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await csvToJson(await response.text());
        setFileData(data);
        cacheFileData.set(url, data);
      } else {
        setHasError(true);
        setErrorMessage("Error downloading file");
      }
    } catch (error: any) {
      setHasError(true);
      setErrorMessage(error.message);
      setFileData(null);
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchData = async () => {
    if (!fileObject) return setFileData(null);
    handleDownloadFile(`${URIs.API_URL}/file?fileName=${fileObject.name}`);
  };

  useEffect(() => {
    fetchData();
    setHasError(false);
  }, [fileObject]);

  if (isDownloading) {
    return (
      <Modal>
        <WindowHeaderBar
          title="Downloading..."
          onClose={
            onClose ||
            (() => {
              setFileData(null);
            })
          }
          icon={<MdFilePresent />}
        />
        <div className="p-4 flex flex-col items-center justify-center">
          <BiLoader size={32} className="animate-spin" />
          <span className="text-gray-500 text-sm">
            Downloading file, please wait...
          </span>
        </div>
      </Modal>
    );
  }

  if (hasError) {
    return (
      <Modal className="border-red-500/20">
        <WindowHeaderBar
          class={{
            container: "bg-red-500/20 border-red-500/20",
            titleBar: "text-red-500",
            iconContainer: "bg-red-500/30 text-red-500",
          }}
          title={`Error Downloading File: ${fileObject?.name}`}
          onClose={
            onClose ||
            (() => {
              setFileData(null);
            })
          }
          icon={<MdErrorOutline />}
        />
        <div className="p-4 flex flex-col items-center justify-center">
          <MdError size={32} className="text-red-500" />
          <span className="text-red-500 text-sm text-center ">
            {errorMessage}
          </span>
          <p className="text-gray-500 text-xs text-center max-w-xs mt-4 border-y py-2 border-gray-500/20">
            Please try downloading the file again. If the issue persists, please
            contact support.
          </p>
        </div>
      </Modal>
    );
  }
  if (!fileData) return null;

  return (
    <Modal
      className={twMerge(
        isMaximized ? "max-w-full w-full" : "max-w-7xl",
        theme.heading_border,
        className
      )}
    >
      <WindowHeaderBar
        onExpand={(isMaximized) => {
          setIsMaximized(isMaximized);
        }}
        isExpanded={isMaximized}
        onSearch={
          showFullData
            ? undefined
            : (searchValue) => {
                setSearchValue(searchValue);
              }
        }
        // isExpanded={isMaximized}
        title={fileObject?.name || "File View"}
        onClose={
          onClose ||
          (() => {
            setFileData(null);
          })
        }
        icon={<MdFilePresent />}
      />
      <div className="p-4">
        <div
          className={twMerge(
            "overflow-x-auto w-full max-h-[calc(100vh-150px)] rounded-md border border-green-500/20"
          )}
        >
          <Table
            onFullData={(showFullData) => {
              setShowFullData(showFullData);
            }}
            data={
              Array.isArray(fileData)
                ? fileData.filter((item) =>
                    Object.values(item).some((value) =>
                      typeof value === "string"
                        ? value
                            ?.toLowerCase()
                            ?.includes(searchValue.toLowerCase())
                        : JSON.stringify(value)
                            ?.toLowerCase()
                            ?.includes(searchValue.toLowerCase())
                    )
                  )
                : Object.values(fileData as Record<string, string>[]).filter(
                    (item) =>
                      Object.values(item).some((value) =>
                        typeof value === "string"
                          ? value
                              ?.toLowerCase()
                              ?.includes(searchValue.toLowerCase())
                          : JSON.stringify(value)
                              ?.toLowerCase()
                              ?.includes(searchValue.toLowerCase())
                      )
                  )
            }
            themeColor={themeColor || "purple"}
            animate
            onSelect={(data) => {
              setSelectedData(data);
            }}
            clearSelectedData={selectedData.length <= 0}
          />
        </div>
        <div className="flex flex-row items-center justify-end mt-4">
          {selectedData.length > 0 && (
            <>
              <IconButton
                text="Clear"
                onClick={() => {
                  setSelectedData([]);
                }}
              />
              <IconButton
                text={`Delete ${selectedData.length} - ${
                  selectedData.length === 1 ? "item" : "items"
                }`}
                color="red"
                className="mr-2"
                onClick={() => {
                  const confirmDelete = confirm(
                    "Are you sure you want to delete these items? \n" +
                      selectedData
                        .map(
                          (item, index) =>
                            `${index + 1}. ${
                              Object.entries(item).map(
                                ([key, value]) => `${key}: ${value}`
                              )[0]
                            }`
                        )
                        .join("\n")
                  );
                  if (confirmDelete) {
                    alert("Deleted");
                  }
                }}
              />
            </>
          )}
          <button
            onClick={() => downloadFile("csv")}
            className="text-green-500 hover:outline hover:outline-green-500/20 bg-green-500/20 p-1 rounded-md flex items-center mr-2"
          >
            <MdFilePresent size={16} />
            <span className="whitespace-nowrap text-xs transition-all duration-300">
              Download as CSV
            </span>
          </button>
          <button
            onClick={() => downloadFile("json")}
            className="text-yellow-500 hover:outline hover:outline-yellow-500/20 bg-yellow-500/20 p-1 rounded-md flex items-center"
          >
            <MdFilePresent size={16} />
            <span className="whitespace-nowrap text-xs transition-all duration-300">
              Download as JSON
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FileViewWindow;
