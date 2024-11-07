import React, { useEffect, useState } from "react";
import { AuthError, EventType } from "@azure/msal-browser";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BiLogoMicrosoft } from "react-icons/bi";
import { HiArrowLeft } from "react-icons/hi";
import { PiGoogleLogo } from "react-icons/pi";
import {
  loginRequest,
  loginWithGoogleRequest,
  loginWithMicrosoftRequest,
  signUpRequest,
} from "src/auth/msal.config";
import { useMsal } from "src/auth";
import { SocialMediaAuthButton } from "./components";
import { AuthOverlay } from "src/components/ui";

const Login: React.FC = () => {
  const { msalInstance, pushNotification, setAuthority } = useMsal();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await msalInstance?.handleRedirectPromise();
      await msalInstance?.loginPopup({
        ...loginRequest,
        loginHint: formData.email,
      });
    } catch (error) {
      console.error("Email_login_error: ", error);
    }
  };

  const handleLoginWithGoogle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const request = loginWithGoogleRequest;
    try {
      setAuthority(request.authority || "");
      await msalInstance?.loginPopup(request);
      await msalInstance?.acquireTokenPopup(request);
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`Error code: ${error.errorCode}`);
        console.error(`Error message: ${error.message}`);
        // Handle error based on error code or message
      }
    }
  };

  const handleLoginWithMicrosoft = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      setAuthority(loginWithMicrosoftRequest.authority || "");
      await msalInstance?.handleRedirectPromise();
      await msalInstance?.loginPopup(loginWithMicrosoftRequest);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterWithMail = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      setAuthority(signUpRequest.authority || "");
      await msalInstance?.handleRedirectPromise();
      await msalInstance?.loginPopup(signUpRequest);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    msalInstance?.handleRedirectPromise().catch((error: AuthError) => {
      console.log("error - handleRedirectPromise - login.tsx", error);
    });
  }, []);

  useEffect(() => {
    msalInstance?.addEventCallback((event) => {
      if (event.error) {
        const error = event.error as AuthError;
        pushNotification({
          type: "error",
          title: error.name,
          description: error.message,
          id: error.errorCode || Date.now(),
        });
      }
      if (event.eventType === EventType.LOGIN_START) {
        setIsLoading(true);
      }
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        setIsLoading(false);
      }
      if (event.eventType === EventType.LOGIN_FAILURE) {
        setIsLoading(false);
      }
    });
  }, [msalInstance]);

  const socialMediaAuthItems = [
    {
      icon: PiGoogleLogo,
      onClick: handleLoginWithGoogle,
      text: "Sign in with Google",
      className: "bg-social-google before:bg-black",
      textStyle: "group-hover:text-social-google",
      children: (
        <>
          <PiGoogleLogo className="text-2xl" />
          <span>Sign in with Google</span>
        </>
      ),
    },
    {
      icon: BiLogoMicrosoft,
      onClick: handleLoginWithMicrosoft,
      text: "Sign in with Microsoft",
      className: "bg-social-microsoft-blue before:bg-black",
      textStyle: "group-hover:text-social-microsoft-blue",
      children: (
        <>
          <BiLogoMicrosoft className="text-2xl" />
          <span>Sign in with Microsoft</span>
        </>
      ),
    },
  ];

  if (msalInstance?.getActiveAccount()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {isLoading && <AuthOverlay />}
      <div className=" max-w-lg bg-black-900 rounded-lg relative">
        <button
          className="flex items-center justify-center absolute top-4 left-4 text-black-700 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <HiArrowLeft className="text-2xl" />
        </button>
        <div className="flex flex-col items-center justify-center gap-2 border-b border-black-700 p-4">
          <p className="text-center text-lg font-cascade text-black-500">
            Sign in to your account
          </p>
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
              <h1 className="text-center text-xl font-cascade mt-6">
                Wingman welcomes you!
              </h1>
              <p className="text-center text-black-500">
                Please login through your email or social media account.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-wrap items-center gap-2 *:w-full">
              {socialMediaAuthItems.map((item) => (
                <SocialMediaAuthButton key={item.text} {...item} />
              ))}
            </div>
            <div className="w-full relative">
              <p className="text-center text-black-500 font-cascade">
                ------------- or -------------
              </p>
            </div>
            <form className="flex flex-col w-full">
              <div className="flex flex-col gap-1 font-cascade mb-2">
                <label htmlFor="email" className="text-black-500">
                  Email
                </label>
                <input
                  onChange={handleFormChange}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="user@example.com"
                  className="w-full bg-black-700 p-2 rounded-lg border-none outline-none"
                />
              </div>
              <SocialMediaAuthButton
                onClick={handleLogin}
                className="rounded-md bg-social-linkedin before:bg-social-microsoft-yellow"
                textStyle="group-hover:text-social-linkedin flex items-center justify-center gap-2"
              >
                Sign in
              </SocialMediaAuthButton>
              <p className="flex items-center gap-2 mt-4">
                Don&apos;t have an account?{" "}
                <button
                  onClick={handleRegisterWithMail}
                  className="text-blue-600"
                >
                  Register
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
