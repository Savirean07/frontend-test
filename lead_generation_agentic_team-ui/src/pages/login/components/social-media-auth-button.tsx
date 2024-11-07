import React from "react";
import { Button } from "src/components/ui";
import { buttonProps } from "src/components/ui/button";
import { twMerge } from "tailwind-merge";

export const SocialMediaAuthButton: React.FC<buttonProps> = (props) => {
  const { className, textStyle } = props;
  return (
    <Button
      {...props}
      style={{ backgroundImage: "none" }}
      className={twMerge(
        "rounded-md bg-white before:bg-black",
        className
      )}
      textStyle={twMerge(
        "group-hover:text-white flex items-center justify-center gap-2",
        textStyle
      )}
    />
  );
};
