import { twMerge } from "tailwind-merge";
import { leadGenerationRoles } from "../../asset/lead_generation_roles";
import { Link } from "react-router-dom";

const Roles = () => {
  return (
    <div className="min-h-screen bg-black text-white py-10 flex flex-col justify-center items-center">
      <h1 className="font-bold text-center mt-10 text-3xl sm:text-7xl">
        Roles
      </h1>
      <p className="text-center mb-10 text-sm sm:text-base border-y border-white/10 py-4 px-4 max-w-3xl mx-auto text-white/50">
        {`We have a wide range of roles available for you to choose from. Click on the role that you want to play and start your journey.`}
      </p>
      <div className="columns-1 sm:columns-2 lg:columns-3 max-w-7xl mx-auto gap-x-4 gap-y-4 px-4">
        {leadGenerationRoles.map((role) => {
          const { Icon } = role;
          return (
            <div
              key={role.id}
              className={twMerge(
                "flex flex-col gap-4 bg-white/10 rounded-md w-96 overflow-hidden relative font-cascade hover:outline outline-8 ease-in-out duration-300 min-h-[350px]",
                role.themeColor?.primary?.replace(/text/, "outline")
              )}
            >
              <img
                src={role.image_url}
                alt={role.image_alt}
                className="w-full h-64 object-top object-cover "
              />
              <div className="flex flex-col gap-4 p-4 grow">
                <p className="flex items-center gap-2">
                  <span
                    className={twMerge(
                      "bg-white/10 rounded-full p-2 bg-opacity-20",
                      role.themeColor?.primary?.replace(/text/, "bg"),
                      role.themeColor?.primary
                    )}
                  >
                    {Icon && <Icon />}
                  </span>{" "}
                  <span className="line-clamp-1 hover:line-clamp-none">
                    {role.tag_line}
                  </span>
                </p>
                <h1
                  className={twMerge(
                    "text-4xl font-bold leading-none grow",
                    role.themeColor?.primary
                  )}
                >
                  {role.title}
                </h1>
                {/* <p className="text-sm text-white/80">{role.description}</p> */}
                <div className="flex gap-4">
                  {role.button.map((button) => {
                    return (
                      <Link
                        to={button.link}
                        key={button.text}
                        className={twMerge(
                          "bg-white/10 rounded-full px-3 py-2 w-fit text-sm bg-opacity-20 hover:bg-opacity-100 transition-all duration-300 border border-white/10",
                          role.themeColor?.secondry?.replace(/text/, "bg")
                        )}
                      >
                        {button.text}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roles;
