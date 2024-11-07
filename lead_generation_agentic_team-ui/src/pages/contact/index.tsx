import React from "react";
import {
  IoBusinessOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoMailOpenOutline,
} from "react-icons/io5";
import { PiXLogoFill } from "react-icons/pi";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="max-w-7xl mx-auto bg-black text-white p-10 py-20">
        <h1 className="text-7xl font-bold my-14">Contact Us</h1>
        <div className="flex gap-10 bg-black-900 p-6 rounded-lg  animate-slide-up">
          <div className="flex flex-col gap-10 bg-black-800 p-10 rounded-lg relative w-1/2">
            <div>
              <h1 className="text-4xl font-bold">Contact Information</h1>
              <p className="text-lg">
                If you have any questions or need assistance, please feel free
                to contact us.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span>
                <IoMailOpenOutline className="text-2xl" />
              </span>
              <p className="text-base">contact@wintellisys.com</p>
            </div>
            <div className="flex items-center gap-4">
              <span>
                <IoCallOutline className="text-2xl" />
              </span>
              <p className="text-lg">(901) 248-0004</p>
            </div>
            <div className="flex items-center gap-4">
              <span>
                <IoLocationOutline className="text-2xl" />
              </span>
              <p className="text-lg">
                6000 Poplar Avenue, Suite 250, Memphis, TN 38119
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span>
                <IoBusinessOutline className="text-2xl" />
              </span>
              <p>Nationwide, Canada, and the United Kingdom</p>
            </div>
            <div className="flex items-center gap-4 absolute bottom-6">
              <a
                href="https://www.instagram.com/wealthwingman.software/"
                className="hover:text-social-instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.facebook.com/people/Wealth-Wingman/61557283820435/"
                className="hover:text-social-facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoFacebook className="text-2xl" />
              </a>
              <a
                href="https://twitter.com/_WealthWingman"
                className="hover:text-social-twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PiXLogoFill className="text-2xl" />
              </a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-1/2 p-4 pl-0">
            <input
              className="bg-black text-white p-2 px-4 rounded-lg border border-white/10"
              type="text"
              placeholder="Name"
            />
            <input
              className="bg-black text-white p-2 px-4 rounded-lg border border-white/10"
              type="email"
              placeholder="Email"
            />
            <input
              className="bg-black text-white p-2 px-4 rounded-lg border border-white/10"
              type="tel"
              placeholder="Phone"
            />
            <textarea
              rows={6}
              className="bg-black text-white p-2 px-4 rounded-lg border border-white/10"
              placeholder="Message"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
