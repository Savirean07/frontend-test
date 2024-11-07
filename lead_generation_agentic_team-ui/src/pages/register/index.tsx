import { HiArrowLeft } from "react-icons/hi";
import { PiGithubLogo, PiGoogleLogo } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "src/components/ui";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" max-w-lg bg-black-900 rounded-lg relative animate-slide-up">
        <button
          className="flex items-center justify-center absolute top-4 left-4 text-black-700 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <HiArrowLeft className="text-2xl" />
        </button>
        <div className="flex flex-col items-center justify-center gap-2 border-b border-black-700 p-4">
          <h1 className="text-center text-lg font-cascade text-black-500">
            Register your account
          </h1>
        </div>
        <div className="flex flex-col gap-4 p-16 pt-0">
          <div className=" rounded-lg p-4 flex flex-col items-center justify-between">
            <Link to="/" className="w-1/4">
              <img
                src="/image/Wintellisys_Logo 1.png"
                alt="logo"
                className="w-full"
              />
            </Link>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-center text-xl font-cascade mt-6">
                Welcome to Wingman
              </p>
              <p className="text-center text-black-500">
                You can register your account with your email or social media
                account.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <form className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="email" className="text-black-500">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="user@example.com"
                  className="w-full bg-black-800 p-2 rounded-lg border-none outline-none"
                />
              </div>

              <Button
                style={{ backgroundImage: "none" }}
                className="w-full bg-blue-600 before:bg-blue-700 text-white rounded-lg mt-4"
              >
                Continue
              </Button>
            </form>
            <p className="text-center text-black-500 self-start">
              If you have an account, you can sign in.{" "}
              <Link to="/login" className="text-blue-600">
                Sign in
              </Link>
            </p>
            <div className="w-full relative">
              <p className="text-center text-black-500 font-cascade">
                ------------- or -------------
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 *:w-full">
              <Button
                style={{ backgroundImage: "none" }}
                className="rounded-md bg-social-google before:bg-red-900 gap-4 w-full"
                textStyle="group-hover:text-white flex items-center justify-center gap-2 "
              >
                <PiGoogleLogo className="text-2xl" />
                <span>Register with Google</span>
              </Button>
              <Button
                style={{ backgroundImage: "none" }}
                className="rounded-md bg-social-github before:bg-black-700"
                textStyle="group-hover:text-white flex items-center justify-center gap-2"
              >
                <PiGithubLogo className="text-2xl" />
                <span>Register with GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
