import React, { ButtonHTMLAttributes, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textStyle?: string;
}

const Button: React.FC<buttonProps> = (props) => {
  const { children, className, textStyle, ...rest } = props;

  const buttonElement = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (buttonElement.current) {
      const btn = buttonElement.current;
      btn.onmouseenter = (e) => {
        btn.style.setProperty("--btn-left", e.offsetX + "px");
        btn.style.setProperty("--btn-top", e.offsetY + "px");
      };
    }
  }, []);

  return (
    <button
      ref={buttonElement}
      {...rest}
      className={twMerge(
        "font-cascade bg-gradient-to-tr from-gradient-primary to-gradient-secondary rounded-full px-6 py-2 btn-before relative group",
        className
      )}
    >
      <span
        className={twMerge(
          "group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-tr from-gradient-primary to-gradient-secondary z-10 relative",
          textStyle
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
