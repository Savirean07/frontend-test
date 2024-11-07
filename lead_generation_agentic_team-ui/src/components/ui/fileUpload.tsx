import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";

const FileUpload = () => {
  const [_, setFileData] = useState<string | Object | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(() => {
          try {
            const isJson =  reader.result?.toString();
            return isJson ? JSON.parse(reader.result as string) : reader.result as string;
          } catch (error) {
            return reader.result as string;
          }
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="file"
        className="relative aspect-video text-sm w-full border-blue-500/30 border-2 border-dashed hover:border-blue-500/60 transition-all duration-300 p-2 rounded-md flex flex-col justify-center items-center group"
      >
        <span className="flex flex-col justify-center items-center text-blue-500/60 group-hover:text-blue-500 transition-all duration-300">
          <MdCloudUpload size={64} />
          <p className="text-sm">Local File</p>
          <p className="text-xs text-gray-500/60 group-hover:text-blue-500 transition-all duration-300">
            (File should be in .csv or .json format)
          </p>
          <p className="text-xs text-gray-500/60 group-hover:text-blue-500 transition-all duration-300">
            Max file size is 1MB
          </p>
        </span>
      </label>
      <input
        onChange={handleFileChange}
        type="file"
        id="file"
        className="hidden"
        accept={".csv,.json"}
      />
    </div>
  );
};

export default FileUpload;
