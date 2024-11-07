import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextAnimation } from "src/components/animation";
import { leadGenerationRoles } from "src/asset/lead_generation_roles";
import { twMerge } from "tailwind-merge";
import BobbleAnimation from "./bobbleAnimation";

interface HeroBannerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  animationClassName?: string;
}

let interval: NodeJS.Timeout;
let timeout: NodeJS.Timeout;

const HeroBanner = (props: HeroBannerProps) => {
  const navigate = useNavigate();
  const [serviceIndex, setServiceIndex] = useState(
    Math.floor(Math.random() * leadGenerationRoles.length)
  );

  const handleStartInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      setServiceIndex(
        (prevIndex) => (prevIndex + 1) % leadGenerationRoles.length
      );
    }, 10000);
  };

  useEffect(() => {
    handleStartInterval();
    return () => clearInterval(interval);
  }, []);

  const handleMouseOver = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleStartInterval();
    }, 10000);
  };

  const handleMouseLeave = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    handleStartInterval();
  };

  const children = () => {
    if (props.children) {
      return props!.children;
    }

    return leadGenerationRoles.map((item, index) => {
      const isActive = index === serviceIndex;
      return (
        isActive && (
          <>
            <div
              key={item.title + item.id + index}
              className="flex flex-col gap-4  font-cascade min-w-[768px]"
            >
              <div className="max-w-3xl">
                <TextAnimation
                  text={item.tag_line}
                  duration={500}
                  delay={500}
                  className={twMerge(
                    "text-blue-500 text-xl uppercase animate-slide-up",
                    item.themeColor?.primary
                  )}
                  Icon={item.Icon}
                />
                <TextAnimation
                  text={item.title}
                  duration={500}
                  className="text-white text-7xl mb-8 font-bold  animate-slide-down mt-4"
                />
                <TextAnimation
                  className="animate-slide-down text-gray-400"
                  duration={500}
                  delay={500}
                  text={item.description}
                />
              </div>
              <div className="text-white h-fit leading-3 animate-slide-right">
                <button
                  onClick={() => {
                    navigate(item.button[0].link);
                  }}
                  className={twMerge(
                    "text-lg relative border px-6 py-2 rounded-full font-normal btn-before bg-white text-black",
                    item.themeColor?.primary?.replace(/text/, "bg"),
                    "border-transparent"
                  )}
                >
                  <TextAnimation
                    parentHidden
                    text={item.button[0].text}
                    duration={500}
                    delay={500}
                    className="z-10 relative"
                  />
                </button>

                <button
                  onClick={() => {
                    navigate(item.button[1].link);
                  }}
                  className={twMerge(
                    "text-lg relative border px-6 py-2 rounded-full font-normal btn-before ml-8"
                  )}
                >
                  <TextAnimation
                    parentHidden
                    text={item.button[1].text}
                    duration={500}
                    delay={1000}
                  >
                    <span className="animate-slide-right inline-block relative ml-2">
                      {"->"}
                    </span>
                  </TextAnimation>
                </button>
              </div>
            </div>
            <img
              key={item.image_url + index}
              src={item.image_url}
              alt={item.image_alt}
              className="w-[30%] object-cover rounded-xl animate-slide-right shadow-[16px_16px_rgba(0,0,0,0.5)] outline outline-white/20"
            />
          </>
        )
      );
    });
  };
  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen h-screen"
    >
      <div className="h-full z-10 relative bg-black/30 flex justify-around items-center">
        {children()}
      </div>
      <div className="flex gap-2 justify-center items-center -mt-10">
        {leadGenerationRoles.map((value, index) => {
          const isActive = index === serviceIndex;
          return (
            <button
              key={value.id}
              onClick={() => {
                setServiceIndex(index);
              }}
              className={`h-2 bg-white rounded-full cursor-pointer z-10 ease-in-out duration-300 ${
                isActive ? "opacity-100 w-4" : "opacity-50 w-2"
              }`}
            ></button>
          );
        })}
      </div>
      <BobbleAnimation
        className={props.animationClassName || ""}
        babbleNos={5}
      />
    </div>
  );
};

export default HeroBanner;
