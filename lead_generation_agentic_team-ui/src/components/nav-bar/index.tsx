import React, { useEffect } from "react";
import { Link, matchRoutes } from "react-router-dom";
import { BiSolidUpArrow } from "react-icons/bi";

import { routes, SubPath } from "src/asset/routes";
import PathLink from "./components/path-link";
import { twMerge } from "tailwind-merge";

const NavBar = () => {
  const routerLinks = routes;
  const [subPath, setSubPath] = React.useState<SubPath[]>([]);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const nav = document.querySelector("#navigation-bar") as HTMLElement;
    if (!nav) return;
    nav.style.top = "0";
    nav.classList.remove("bg-transparent");
    (e.target as HTMLElement).style.height = "0";
  };

  useEffect(() => {
    let scrollPos = 0;
    const navScrollMargin = 50;
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("#navigation-bar") as HTMLElement;
      if (!nav) return;
      const hoverDiv = nav.querySelector("#hover-div") as HTMLElement;
      if (window.scrollY > Math.max(scrollPos, navScrollMargin)) {
        nav.style.top = "-100px";
        nav.classList.add("bg-transparent");
        hoverDiv.style.height = "40px";
      } else {
        nav.classList.remove("bg-transparent");
        nav.style.top = "0";
        hoverDiv.style.height = "0";
      }

      if (window.scrollY > 50) {
        nav.classList.add("bg-black-900");
        setSubPath([]);
      } else {
        nav.classList.remove("bg-black-900");
      }

      scrollPos = window.scrollY;
    });
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll("#links > li");
    const linksArray = Array.from(links);
    linksArray.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        const target = e.target as HTMLElement;
        const elementBoundary = target.getBoundingClientRect();
        const childNode = target.childNodes[0] as HTMLLinkElement;
        const pathName = new URL(childNode.href).pathname;
        const pathRoutes = matchRoutes(routerLinks, pathName)?.at(0)?.route;
        if (!pathRoutes?.subPath) return setSubPath([]);
        setSubPath(pathRoutes.subPath);
        const dropDownList = document.querySelector(
          "#drop-down-list-sub-paths"
        ) as HTMLElement;
        dropDownList.style.left = `${elementBoundary.left}px`;
        dropDownList.style.top = `${
          document.querySelector("nav")?.clientHeight
        }px`;
        window.addEventListener("resize", () => {
          setSubPath([]);
        });
      });
    });

    const body = document.querySelector("body") as HTMLElement;
    body.addEventListener("click", (e) => {
      if (!(e.target as HTMLElement).closest("#links")) {
        setSubPath([]);
      }
    });
  }, []);

  return (
    <>
      <nav
        id="navigation-bar"
        className="h-fit fixed w-full z-20 ease-in-out duration-300"
      >
        <div className="max-w-5xl m-auto flex justify-between items-center p-4">
          <Link
            to={"/"}
            className="flex items-center gap-2 text-xl font-extrabold font-cascade text-blue-400"
          >
            <img
              className="max-w-28"
              src="/image/Wintellisys_Logo 1.png"
              alt="Wintellisys"
            />
          </Link>
          <PathLink />
        </div>
        <div
          id="drop-down-list-sub-paths"
          className="absolute ease-in-out duration-700"
        >
          {subPath.length > 0 && (
            <div className="aspect-square w-6 absolute -top-3.5 left-2 rounded animate-slide-up">
              <BiSolidUpArrow size={18} className="fill-black-800" />
            </div>
          )}
          <ul className=" divide-y divide-black">
            {subPath?.map((subLink) => (
              <li
                className="first:rounded-t-lg last:rounded-b-lg bg-black-800 hover:bg-black-900 animate-slide-up"
                key={subLink.id}
              >
                <Link
                  className={twMerge(
                    "px-2 py-1 w-full flex flex-wrap max-w-64 gap-2 items-center group",
                    subLink.color?.text
                  )}
                  to={subLink.path}
                  target={subLink.target}
                >
                  {subLink.Icon && (
                    <span
                      className={twMerge(
                        subLink.color?.text,
                        subLink.color?.bg,
                        "bg-opacity-15 p-1 rounded"
                      )}
                    >
                      {<subLink.Icon size={20} />}
                    </span>
                  )}
                  {subLink.name}
                  <span className="text-sm text-black-500 overflow-hidden ease-in-out duration-300 h-0 group-hover:h-10">
                    {subLink?.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          id="hover-div"
          onMouseOver={handleMouseOver}
          className="h-10 w-full top-0 ease-in-out duration-300"
        ></div>
      </nav>
    </>
  );
};

export default NavBar;
