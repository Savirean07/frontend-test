import { Link } from "react-router-dom";
import { routes } from "src/asset/routes";

const Footer = () => {
  return (
    <footer className=" bg-black-900 pt-10 font-cascade">
      <div className=" text-white p-5 max-w-7xl mx-auto">
        <div className="h-28 max-w-5xl w-full bg-blue-600 rounded-2xl flex justify-between items-center px-10 mx-auto mb-10">
          <div>
            <h1 className="text-2xl font-bold">Subscribe To get updated</h1>
            <p className="text-sm">
              we will immediately update you with the latest news
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="p-2 rounded-lg bg-transparent border border-white outline-none text-white px-4 placeholder:text-white/80"
              type="text"
              placeholder="Enter your email"
            />
            <button className="bg-white text-blue-600 p-2 px-4 rounded-lg hover:bg-blue-900 hover:text-white transition-all duration-300 ease-in-out active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
        <div className="container mx-auto mt-10">
          <div className="flex justify-start items-start gap-20 font-cascade">
            <div className="flex items-start gap-4 flex-col max-w-xs">
              <img
                className="w-64"
                src="/image/Wintellisys_Logo 1.png"
                alt="logo"
              />
              <p className="text-sm">
                We are a team of experts in the field of technology, cloud
                computing, artificial intelligence, cloud infrastructure, and
                web development. We are here to help you with your problems.
              </p>
            </div>
            <div className="text-2xl font-bold w-full mt-12">
              <h1>Quick Links</h1>
              <ul className="flex justify-around text-sm text-white/80 mt-2 font-medium">
                {routes.map((link) => (
                  <li key={link.id}>
                    <Link
                      className="hover:text-blue-600 text-lg bg-blue-600/20 px-2 py-1 rounded-md"
                      to={link.path}
                    >
                      {link.name}
                    </Link>
                    {link.subPath && (
                      <ul className="flex flex-col gap-2 text-sm text-white/80 mt-2 font-medium">
                        {link.subPath.map((subLink) => (
                          <li className="" key={subLink.id}>
                            <Link
                              className="hover:text-blue-600 text-sm hover:underline underline-offset-4"
                              to={subLink.path}
                            >
                              - {subLink.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-white/80 text-sm mt-10 py-5 border-t border-white/10">
        <p>Copyright © 2024 Wintellisys. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
