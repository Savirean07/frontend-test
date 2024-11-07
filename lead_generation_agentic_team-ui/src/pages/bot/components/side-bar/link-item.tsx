import React from "react";

type props = {
  url?: string;
  title?: string;
  children?: React.ReactNode;
};

const LinkItem = ({ url, title, children }: props) => {
  return (
    <li className="font-cascade flex gap-2 text-white/80 py-0.5 text-sm before:content-['-_'] cursor-pointer my-1 aria-busy:text-orange-500">
      <a href={url || "#"}>
        <p className="line-clamp-1 hover:line-clamp-4 ease-in-out duration-200 hover:underline underline-offset-2 hover:text-blue-500">
          {title || children}
        </p>
      </a>
    </li>
  );
};
export default LinkItem;
