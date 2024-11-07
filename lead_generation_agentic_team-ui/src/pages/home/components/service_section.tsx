import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { Button } from "src/components/ui";

interface ServiceViewProps {
  blog: {
    id?: string | number;
    heading: string;
    title: string;
    description: string;
    content?: string;
    image?: string;
    hero_image?: string;
    timestamp: number | string;
    author: string;
    Icon?: React.ElementType;
    color?: {
      primary?: string;
      secondary?: string;
    };
    tags?:
      | [
          "AI",
          "Marketing",
          "Digital Media",
          "Artificial Intelligence",
          "Data Analytics",
          "Predictive Modeling",
          "Personalized Marketing",
          "Competitive Intelligence"
        ]
      | string[];
  };
  isOdd?: boolean;
}

const ServiceView = (props: ServiceViewProps) => {
  const { blog, isOdd } = props;
  const navigate = useNavigate();
  return (
    <div
      className={twMerge(
        "relative min-h-screen h-screen bg-blend-overlay bg-cover bg-center bg-black/30 flex justify-center items-center gap-32 snap-center",
        !isOdd ? "flex-row-reverse" : "flex-row",
        blog.color?.primary?.replace("text-", "bg-"),
        "bg-opacity-10"
      )}
    >
      <div className="max-w-xl w-full *:w-fit order-1">
        {blog.Icon && (
          <span
            className={twMerge(
              " bg-white p-2 rounded inline-block text-xl bg-opacity-20 -mb-5",
              blog.color?.secondary?.replace("text-", "bg-")
            )}
          >
            <blog.Icon className={twMerge("text-black", blog.color?.primary)} />
          </span>
        )}
        <h1
          className={twMerge(
            "text-7xl leading-none font-semibold my-4",
            blog.color?.primary
          )}
        >
          {blog.heading}
        </h1>
        <h2 className="text-3xl">{blog.title}</h2>
        <p className="my-6 text-black-300">{blog.description}</p>
        <div className="flex flex-wrap gap-2 my-4">
          {blog.tags?.slice(0, 7).map((tag) => (
            <span
              key={tag}
              className={twMerge(
                "text-xs border border-white/20 text-white/50 hover:bg-white hover:text-black rounded-full px-2 py-1"
              )}
            >
              {tag}
            </span>
          ))}
          {blog.tags && blog.tags?.length > 7 && (
            <span className="text-xs bg-white/50 text-black rounded-full px-2 py-1">
              {blog.tags?.length - 7} More
            </span>
          )}
        </div>
        <div
          className={twMerge(
            "h-1.5 rounded !w-full mb-6 shadow-[6px__6px_rgba(0,0,0,0.5)]",
            blog.color?.primary?.replace("text-", "bg-")
          )}
        ></div>
        <Button
          className={twMerge(blog.color?.primary?.replace("text-", "bg-"))}
          onClick={() => navigate("blog/" + blog.id)}
        >
          read more {"->"}
        </Button>
      </div>
      <div className="max-w-xl w-full *:w-fit  scroll-animation order-2">
        <img
          className=" rounded-3xl shadow-[16px_16px_rgba(0,0,0,0.5)] outline outline-white/20"
          src={blog.image}
          alt=""
        />
      </div>
    </div>
  );
};

export default ServiceView;
