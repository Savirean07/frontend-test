import React, { ButtonHTMLAttributes, useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textStyle?: string;
  gradient?: boolean;
}

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode | null;
  text: string;
  hideIcon?: boolean;
  color?:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "orange"
    | "gray"
    | "white"
    | "black"
    | "pink"
    | "gray-dark"
    | "green-dark"
    | "blue-dark"
    | "yellow-dark"
    | "purple-dark"
    | "orange-dark"
    | "gray-dark"
    | "white-dark"
    | "black-dark"
    | "pink-dark"
    | "violet-dark";
}

export const IconButton = (props: IconButtonProps) => {
  const { icon, className, text, hideIcon, color, disabled, hidden, ...rest } =
    props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const iconWidth = useMemo(() => {
    if (hideIcon) {
      return 8;
    }
    return (iconRef.current?.offsetWidth || 14) + 8;
  }, [hideIcon, iconRef.current]);

  useEffect(() => {
    if (buttonRef.current && textRef.current && !disabled) {
      const width = textRef.current.offsetWidth + iconWidth;
      buttonRef.current.style.setProperty("--x", `${width}px`);
    }
  }, [buttonRef.current, textRef.current, text, iconWidth]);

  const colorClasses = {
    red: "text-red-500 bg-red-500/20",
    green: "text-green-500 bg-green-500/20",
    blue: "text-blue-500 bg-blue-500/20",
    yellow: "text-yellow-500 bg-yellow-500/20",
    purple: "text-purple-500 bg-purple-500/20",
    orange: "text-orange-500 bg-orange-500/20",
    gray: "text-gray-500/80 bg-gray-500/20",
    white: "text-white/80 bg-white/20",
    black: "text-black/80 bg-black/20",
    pink: "text-pink-500/80 bg-pink-500/20",
    "gray-dark": "text-gray-800/80 bg-gray-800/20",
    "green-dark": "text-green-800/80 bg-green-800/20",
    "blue-dark": "text-blue-800/80 bg-blue-800/20",
    "yellow-dark": "text-yellow-800/80 bg-yellow-800/20",
    "purple-dark": "text-purple-800/80 bg-purple-800/20",
    "orange-dark": "text-orange-800/80 bg-orange-800/20",
    "white-dark": "text-white-800/80 bg-white-800/20",
    "black-dark": "text-black-800/80 bg-black-800/20",
    "pink-dark": "text-pink-800/80 bg-pink-800/20",
    "violet-dark": "text-violet-800/80 bg-violet-800/20",
  };

  if (hidden) return;

  return (
    <button
      {...rest}
      disabled={disabled}
      ref={buttonRef}
      className={twMerge(
        "cursor-pointer gap-1 p-1 rounded-md group/icon-btn flex items-center text-xs relative w-[22px] overflow-hidden ease-in-out duration-300",
        color
          ? colorClasses[color]
          : "text-white/80 group-hover/icon-btn:text-white bg-white/20 group-hover/icon-btn:bg-white/30",
        className,
        disabled
          ? "grayscale cursor-auto"
          : icon
          ? "hover:w-[calc(var(--x)_+_8px)]"
          : "w-fit"
      )}
    >
      {icon && (
        <span
          ref={iconRef}
          className={twMerge(
            " text-sm",
            hideIcon
              ? "group-hover/icon-btn:w-0 group-hover/icon-btn:overflow-hidden"
              : ""
          )}
        >
          {icon}
        </span>
      )}
      <span
        ref={textRef}
        className={twMerge("whitespace-nowrap", disabled ? "hidden" : "")}
      >
        {text}
      </span>
    </button>
  );
};

const Button: React.FC<buttonProps> = (props) => {
  const { children, className, textStyle, gradient, ...rest } = props;

  const buttonElement = useRef<HTMLButtonElement | null>(null);

  const btnBeforeStyle = `
  before:h-full before:top-0 before:opacity-0
  before:hover:left-[var(--x)] before:w-[0%] before:hover:w-full before:hover:top-0 before:hover:opacity-100
  before:right-0 before:z-0 before:bg-white rounded-inherit
  before:absolute before:ease-in-out before:duration-200 hover:text-black hover:border-transparent
  `;

  useEffect(() => {
    if (buttonElement.current) {
      let timer: NodeJS.Timeout | null = null;
      buttonElement.current.addEventListener("mouseenter", () => {
        buttonElement.current?.classList.remove("before:left-0");
        buttonElement.current?.classList.add("before:hover:right-0");
        timer = setTimeout(() => {
          buttonElement.current?.classList.remove("before:hover:right-0");
          buttonElement.current?.classList.add("before:left-0");
        }, 100);
      });

      buttonElement.current.addEventListener("mouseleave", () => {
        if (timer) {
          clearTimeout(timer);
        }
      });

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
    return;
  }, []);

  return (
    <button
      ref={buttonElement}
      {...rest}
      className={twMerge(
        "font-cascade rounded-full px-6 py-2 relative group",
        btnBeforeStyle,
        gradient
          ? "bg-gradient-to-tr from-gradient-primary to-gradient-secondary"
          : "",
        className
      )}
    >
      <span
        className={twMerge(
          "group-hover:bg-clip-text group-hover:text-black z-10 relative ease-in-out duration-200 text-white",
          textStyle,
          gradient
            ? "bg-gradient-to-tr from-gradient-primary to-gradient-secondary"
            : ""
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
