import { useEffect, useRef, useState } from "react";
import { Link, matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { Button } from "src/components/ui";
import { routes } from "src/asset/routes";
import { authorityObject, graphApiEndpoints } from "src/auth/msal.config";
import { AccountInfo } from "@azure/msal-browser";
import { UserProfilePopup } from "./userProfilePopup";
import { useMsal } from "src/auth";
import { MdLogin } from "react-icons/md";

const PathLink = () => {
  const navigate = useNavigate();
  const { msalInstance, authority } = useMsal();
  const isLoggedIn = msalInstance?.getActiveAccount();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  const navSelectSlider = useRef<HTMLDivElement>(null);
  const navHoverSlider = useRef<HTMLDivElement>(null);
  const navLink = useRef<HTMLUListElement>(null);

  const location = useLocation();

  const data = matchRoutes(routes, window.location.pathname);
  const currentPathRoute = data
    ? data?.at(0)?.route
    : routes.find(
        ({ path }) => path === window.location.pathname.split(/\//).at(1)
      );

  const handleLogout = async () => {
    if (!isLoggedIn) return;
    const tenantId = (
      isLoggedIn?.tenantId || "B2C_1_microsoft_sign_in"
    ).toLowerCase();
    const authority =
      authorityObject[tenantId.toLowerCase() as keyof typeof authorityObject];

    try {
      await msalInstance?.handleRedirectPromise();
      await msalInstance?.logoutPopup({
        authority,
        account: isLoggedIn,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = () => {
    if (isLoggedIn) return;
    navigate("/login");
  };

  const handleGetUserProfileImage = async () => {
    if (!msalInstance?.getActiveAccount()) return;
    try {
      const authResult = await msalInstance?.acquireTokenSilent({
        account: msalInstance?.getActiveAccount() as AccountInfo,
        scopes: ["profile", "openid", "email"],
        authority: authority as string,
      });
      const response = await fetch(graphApiEndpoints.graphPhotoEndpoint, {
        headers: {
          Authorization: `Bearer ${authResult?.accessToken}`,
        },
      });
      if (!response.ok) return;
      const photoBlob = await response.blob();
      const photoURL = URL.createObjectURL(photoBlob);
      setUserProfileImage(photoURL);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!navLink.current || !currentPathRoute) return;
    const navLinks = navLink.current.childNodes;
    navLinks.forEach((link, key) => {
      const linkElement = link as HTMLLIElement;
      linkElement.addEventListener("mouseenter", () => {
        const currentPathIndex = routes.findIndex(
          ({ path }) => path === `${window.location.pathname.split(/\//).at(1)}`
        );

        if (key === currentPathIndex) {
          navSelectSlider.current!.style.scale = "1.1 1";
          return;
        }
        navHoverSlider.current!.style.left = `${linkElement.offsetLeft}px`;
        navHoverSlider.current!.style.width = `${linkElement.offsetWidth}px`;
      });
    });

    navLinks.forEach((link) => {
      const linkElement = link as HTMLLIElement;
      linkElement.addEventListener("mouseleave", () => {
        navHoverSlider.current!.style.width = `0px`;
        navSelectSlider.current!.style.scale = "1";
      });
    });
  }, []);

  useEffect(() => {
    if (!currentPathRoute) return;
    const currentPathIndex = routes.indexOf(currentPathRoute);
    const linkBgSlider = navSelectSlider.current;
    const links = navLink.current?.children as HTMLCollection;
    const linksArray = Array.from(links);

    if (linkBgSlider) {
      linkBgSlider.style.width = `${
        linksArray[currentPathIndex]!.clientWidth
      }px`;
      linkBgSlider.style.left = `${
        (linksArray[currentPathIndex] as HTMLElement).offsetLeft
      }px`;
    }
  }, [location.pathname]);

  useEffect(() => {
    handleGetUserProfileImage();
  }, []);

  return (
    <div className="flex gap-4 items-center relative">
      <ul
        ref={navLink}
        id="links"
        className="flex gap-4 aria-[current=true]:*:text-black *:ease-in-out *:duration-300 z-10 *:cursor-pointer"
      >
        {routes.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              style={
                link.id === currentPathRoute?.id
                  ? { fontWeight: 700, color: "white" }
                  : {}
              }
              className="text-black-100 font-cascade"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <div
        id="link-bg-slider"
        ref={navSelectSlider}
        className="h-0.5 -bottom-0.5 bg-white absolute z-[1] rounded ease-[cubic-bezier(1,1,_0.53,_1.4)] duration-200"
      ></div>
      <div
        ref={navHoverSlider}
        className="h-0.5 -bottom-0.5 bg-black-500 absolute z-0 rounded ease-[cubic-bezier(1,1,_0.53,_1.4)] duration-200"
      ></div>
      <div className="ml-4 space-x-4 text-sm flex">
        {!isLoggedIn ? (
          <Button
            onClick={handleSignIn}
            className="px-2 py-0.5 rounded !bg-gradient-none text-white bg-blue-600 before:rounded font-cascade"
          >
            <span className="flex items-center gap-2">
              <MdLogin /> Login
            </span>
          </Button>
        ) : (
          <div
            onClick={() => setUserMenuOpen(true)}
            id="user-profile-button"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black-800"
          >
            {userProfileImage ? (
              <img
                src={userProfileImage}
                alt="user profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <p>{isLoggedIn?.name?.at(0)}</p>
            )}
          </div>
        )}
      </div>
      {userMenuOpen && isLoggedIn && (
        <UserProfilePopup
          user={isLoggedIn}
          handleLogout={handleLogout}
          setUserMenuOpen={setUserMenuOpen}
        />
      )}
    </div>
  );
};

export default PathLink;
