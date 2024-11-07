import { MdAnalytics, MdEmail, MdGeneratingTokens } from "react-icons/md";
import { HeroBanner, ServiceView } from "./components";
import { leadGenerationRoles } from "src/asset/lead_generation_roles";

const Home = () => {
  return (
    <div className=" relative overflow-x-hidden snap-y snap-mandatory">
      <HeroBanner />
      <div className="sm:p-24 p-4 bg-gradient-to-tr from-red-100  via-blue-100 to-green-100 flex flex-col sm:gap-8 gap-4 justify-center items-center overflow-x-auto">
        <h1 className="text-black text-3xl sm:text-5xl 2xl:text-7xl  font-extrabold font-cascade text-center">
          <span className="text-red-500">Tools</span> where you can{" "}
          <span className="text-blue-500">play</span> with
          <span className="text-green-500"> AI</span>
        </h1>
        <div className="flex gap-8 text-xl sm:text-5xl 2xl:text-7xl *:p-2 *:sm:p-4 *:2xl:p-6">
          <div className=" bg-black rounded-full  text-red-500  duration-300 ease-in-out">
            <MdGeneratingTokens />
          </div>
          <div className=" bg-black rounded-full  text-blue-500  duration-300 ease-in-out">
            <MdAnalytics />
          </div>
          <div className=" bg-black rounded-full  text-green-500  duration-300 ease-in-out">
            <MdEmail />
          </div>
        </div>
      </div>
      {leadGenerationRoles.map((blog, i) => {
        return (
          <ServiceView
            isOdd={i % 2 === 0}
            blog={{
              author: "unknown",
              description: blog.description,
              heading: blog.title,
              timestamp: 100000,
              title: blog.tag_line,
              image: blog.image_url,
              tags: blog.tags,
              Icon: blog.Icon,
              id: i + 1,
              color: {
                primary: blog.themeColor?.primary,
                secondary: blog.themeColor?.secondry,
              },
            }}
            key={blog.id}
          />
        );
      })}
    </div>
  );
};
export default Home;
