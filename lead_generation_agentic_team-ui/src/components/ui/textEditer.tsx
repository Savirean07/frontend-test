import { useEffect, useState } from "react";

interface TextEditerProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditer = ({ value, onChange }: TextEditerProps) => {
  const [changedText, setChangedText] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChangedText(e.target.value);
    onChange(e.target.value);
  };

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);
  return (
    <div className="w-full h-full p-4 bg-black rounded-md">
      <textarea
        className="w-full h-full bg-transparent outline-none text-sm"
        value={changedText}
        onChange={handleChange}
      ></textarea>
    </div>
  );
};

export default TextEditer;
