import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import jsonData from "../../asset/blog_data";
import { MarkdownToHTML } from "src/components/ui";
import { TextAnimation } from "src/components/animation";

interface blogInterface {
  id: number;
  title: string;
  content: string;
  image: string;
  hero_image?: string;
  timestamp: string;
  author: string;
  tags?: string[];
}

const BlogPage: React.FC = () => {
  const [apiDataState, setApiDataState] = React.useState<string>("initial");
  const [blog, setBlog] = React.useState<blogInterface>({
    id: 0,
    title: "",
    content: "",
    image: "",
    hero_image: "",
    timestamp: "",
    author: "",
    tags: [],
  });

  const { blogId = 1 } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    window.document.title = "Wintellisys | " + jsonData!.blogsData[0]!.title;
    return () => {
      window.document.title = "Wintellisys";
    };
  }, []);

  useEffect(() => {
    const blogData = jsonData.blogsData.find(
      (blog) => blog.id.toString() === blogId
    );
    if (blogData) {
      setBlog(blogData);
      setApiDataState("success");
    } else {
      setApiDataState("error");
    }
  }, [blogId]);

  if (apiDataState === "initial") {
    return <div>Loading...</div>;
  }

  if (apiDataState === "error") {
    return <Navigate to={"/blog"} />;
  }

  return (
    <div className="min-h-screen bg-blue-500 bg-opacity-10 text-white">
      <div className="max-w-5xl mx-auto pt-20" key={blog.id}>
        <TextAnimation
          text={blog.title}
          pace={3}
          contentRenderer={({ text }) => (
            <h1
              style={{
                backgroundImage: "url('/public/image/Designer.jpeg')",
              }}
              className="text-8xl font-extrabold text-white bg-clip-text text-center border-y border-white/10 py-4"
            >
              {text}
            </h1>
          )}
        />
        <ul className="flex flex-wrap mt-4 gap-2">
          {blog.tags?.map((tag, index) => (
            <li key={tag} className="">
              <TextAnimation
                text={tag}
                delay={index === 0 ? 500 : index * 40 + 500}
                contentRenderer={({ text }) =>
                  text ? (
                    <p className="text-white bg-blue-500/20 rounded-full p-2">
                      {text}
                    </p>
                  ) : (
                    <></>
                  )
                }
              />
            </li>
          ))}
        </ul>
        <div className="container mx-auto p-6">
          <div className="mt-4  no-tailwind">
            <MarkdownToHTML
              animationProps={{
                text: blog.content,
                className: "font-cascade",
                pace: 50,
                delay: 1000,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
