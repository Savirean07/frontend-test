import React, { HTMLAttributes, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface NotificationPopupProps extends HTMLAttributes<HTMLDivElement> {
  type: "success" | "error" | "info" | "warning" | "default";
  title: string;
  description: string;
  onClose: () => void;
}

const showDuration = 20000;

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  type,
  title,
  description,
  onClose,
}) => {
  const [color, setColor] = useState({
    title: "",
    description: "",
    border: "",
  });

  const [timer, setTimer] = useState(0);

  const handleSelectColor = (type: string) => {
    switch (type) {
      case "success":
        setColor({
          title: "bg-green-900/50",
          description: "text-green-500",
          border: "border-green-500/50",
        });
        break;
      case "error":
        setColor({
          title: "bg-red-900/50",
          description: "text-red-500",
          border: "border-red-500/50",
        });
        break;
      case "info":
        setColor({
          title: "bg-blue-900/50",
          description: "text-blue-500",
          border: "border-blue-500/50",
        });
        break;
      case "warning":
        setColor({
          title: "bg-yellow-900/50",
          description: "text-yellow-500",
          border: "border-yellow-500/50",
        });
        break;
      case "default":
        setColor({
          title: "bg-gray-900/50",
          description: "text-gray-500",
          border: "border-gray-500/50",
        });
        break;
      default:
        setColor({
          title: "bg-gray-900/50",
          description: "text-gray-500",
          border: "border-gray-500/50",
        });
        break;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, showDuration);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    handleSelectColor(type);
  }, [type]);

  useEffect(() => {
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 20);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={twMerge(
        "max-w-lg w-full h-fit rounded-lg flex-col gap-4 font-cascade animate-slide-up relative backdrop-blur-xl",
        color.title,
        color.description
      )}
    >
      <p
        className={twMerge(
          "text-sm py-2 text-center relative border-b-2",
          color.border
        )}
      >
        {title}{" "}
        <button
          onClick={onClose}
          className={twMerge("absolute right-2 top-2", color.description)}
        >
          <IoClose />
        </button>
      </p>
      <div
        style={{ width: `${(timer / showDuration) * 100}%` }}
        className={twMerge("h-[1px] bg-gray-500 relative")}
      ></div>
      <p className="p-4">{description}</p>
    </div>
  );
};
