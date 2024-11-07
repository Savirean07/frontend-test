import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Markdown from "react-markdown";
import { IconButton } from "./button";
import MarkdownToHTML from "./markdown";
import {
  MdArrowBack,
  MdCheckCircleOutline,
  MdRadioButtonUnchecked,
} from "react-icons/md";

export interface TableProps {
  data: Record<string, string>[];
  fileName?: string;
  animate?: boolean;
  disable?: boolean;
  themeColor?: "red" | "green" | "blue" | "yellow" | "purple" | "orange";
  clearSelectedData?: boolean;
  onSelect?: (data: Record<string, string>[]) => void;
  onFullData?: (data: boolean) => void;
}

export const getTheme = (themeColor: TableProps["themeColor"]) => {
  switch (themeColor) {
    case "red":
      return {
        heading: "bg-red-500/20",
        heading_text: "text-red-500",
        heading_border: "border-red-500",
        heading_outline: "outline-red-500",
        heading_hover: "hover:bg-red-500/30",
        heading_hover_text: "group-hover:bg-red-500/30",
        divider: "divide-red-500/20",
      };
    case "green":
      return {
        heading: "bg-green-500/20",
        heading_text: "text-green-500",
        heading_border: "border-green-500",
        heading_outline: "outline-green-500",
        heading_hover: "hover:bg-green-500/30",
        heading_hover_text: "group-hover:bg-green-500/30",
        divider: "divide-green-500/20",
      };
    case "blue":
      return {
        heading: "bg-blue-500/20",
        heading_text: "text-blue-500",
        heading_border: "border-blue-500",
        heading_outline: "outline-blue-500",
        heading_hover: "hover:bg-blue-500/30",
        heading_hover_text: "group-hover:bg-blue-500/30",
        divider: "divide-blue-500/20",
      };
    case "yellow":
      return {
        heading: "bg-yellow-500/20",
        heading_text: "text-yellow-500",
        heading_border: "border-yellow-500",
        heading_outline: "outline-yellow-500",
        heading_hover: "hover:bg-yellow-500/30",
        heading_hover_text: "group-hover:bg-yellow-500/30",
        divider: "divide-yellow-500/20",
      };
    case "purple":
      return {
        heading: "bg-purple-500/20",
        heading_text: "text-purple-500",
        heading_border: "border-purple-500",
        heading_outline: "outline-purple-500",
        heading_hover: "hover:bg-purple-500/30",
        heading_hover_text: "group-hover:bg-purple-500/30",
        divider: "divide-purple-500/20",
      };
    case "orange":
      return {
        heading: "bg-orange-500/20",
        heading_text: "text-orange-500",
        heading_border: "border-orange-500",
        heading_outline: "outline-orange-500",
        heading_hover: "hover:bg-orange-500/30",
        heading_hover_text: "group-hover:bg-orange-500/30",
        divider: "divide-orange-500/20",
      };
    default:
      return {
        heading: "bg-gray-500/20",
        heading_text: "text-gray-500",
        heading_border: "border-gray-500",
        heading_outline: "outline-gray-500",
        heading_hover: "hover:bg-gray-500/30",
        heading_hover_text: "group-hover:bg-gray-500/30",
        divider: "divide-gray-500/20",
      };
  }
};

const Table = ({
  data,
  animate,
  disable,
  themeColor,
  onSelect,
  onFullData,
  clearSelectedData,
}: TableProps) => {
  const [isAnimate, setIsAnimate] = useState(false);
  const [dataArray, setDataArray] = useState<Record<string, string>[]>([]);
  const [showFullData, setShowFullData] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<Record<string, string>[]>(
    []
  );

  const theme = getTheme(themeColor);

  const handleCheckboxChange = (
    data: Record<string, string>,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedData([...selectedData, data]);
    } else {
      setSelectedData(selectedData.filter((item) => item !== data));
    }
  };

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedData);
    }
  }, [selectedData]);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setDataArray([]);
    } else {
      setDataArray(data);
    }
  }, [data]);

  useEffect(() => {
    if (!animate) return;
    setIsAnimate(animate);
  }, [animate]);

  useEffect(() => {
    onFullData?.(!!showFullData);
  }, [showFullData]);

  useEffect(() => {
    if (clearSelectedData) {
      setSelectedData([]);
    }
  }, [clearSelectedData]);

  const handleShowFullData = (value: React.MouseEvent<HTMLPreElement>) => {
    if (value.target instanceof HTMLPreElement) {
      setShowFullData(value.target.textContent);
    }
  };

  if (!dataArray.length) return null;

  if (showFullData) {
    return (
      <>
        <div className="w-full overflow-auto relative">
          <MarkdownToHTML
            buttons={
              <>
                <IconButton
                  onClick={() => setShowFullData(null)}
                  text="back"
                  icon={<MdArrowBack />}
                  color="red"
                />
              </>
            }
            animationProps={{
              text: "```json " + showFullData + "\n ```",
              animate: false,
            }}
          />
        </div>
      </>
    );
  }
  if (dataArray.length <= 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">No data found</h1>
      </div>
    );
  }

  return (
    <table className={twMerge("w-full", disable ? "opacity-20" : "")}>
      <thead className={theme?.heading}>
        <tr>
          <th></th>
          {Object.keys(dataArray[0]).map((key) => (
            <th
              key={key}
              className={twMerge(
                theme?.heading_text,
                theme?.heading_border,
                theme?.heading_outline,
                theme?.heading_hover
              )}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={twMerge(theme?.divider, " divide-y", theme?.divider)}>
        {dataArray.map((row, index_1) => {
          return (
            <>
              <tr
                key={row["S.No"]}
                className={twMerge(
                  isAnimate && ` divide-x`,
                  theme?.heading_hover,
                  theme?.divider,
                  selectedData.includes(row) ? "bg-green-500/20" : ""
                )}
              >
                <td>
                  <div className="flex flex-row items-center justify-center p-4 relative cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(row, e.target.checked)
                      }
                      className="rounded-sm absolute w-full h-full opacity-0"
                      checked={selectedData.includes(row)}
                    />
                    {selectedData.includes(row) ? (
                      <span>
                        <MdCheckCircleOutline className="text-green-500" />
                      </span>
                    ) : (
                      <span>
                        <MdRadioButtonUnchecked className="text-gray-500" />
                      </span>
                    )}
                  </div>
                </td>
                {Object.values(row).map((value, index_2, array_2) => (
                  <td
                    key={`${row["S.No"]}-${index_2}-${value}`}
                    className={twMerge(
                      "text-left px-2 py-1 max-w-96 group",
                      index_2 % 2 === 0 ? theme?.divider : "",
                      "animate-slide-right opacity-0"
                    )}
                    style={{
                      animationDelay: `${
                        (index_1 * array_2.length + index_2) * 0.01
                      }s`,
                    }}
                  >
                    <div
                      className={twMerge(
                        "rounded-md p-1 text-sm line-clamp-3 hover:line-clamp-6 ease-in-out duration-500",
                        theme?.heading_hover_text
                      )}
                    >
                      <Markdown
                        components={{
                          pre: ({ node, ...props }) => (
                            <pre
                              onClick={handleShowFullData}
                              className="bg-gray-900 p-1 !rounded-md overflow-auto max-h-56 scrollbar-hidden text-xs cursor-pointer"
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code {...props} className="cursor-text" />
                          ),
                        }}
                      >
                        {typeof value === "object"
                          ? "```json \n\n" +
                            JSON.stringify(value, null, 2) +
                            " \n\n```"
                          : value.slice(0, 300)}
                      </Markdown>
                    </div>
                  </td>
                ))}
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
