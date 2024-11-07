import { AccountInfo } from "@azure/msal-browser";
import React, { useEffect, useRef } from "react";

interface UserProfilePopupProps {
  user: AccountInfo;
  handleLogout: () => void;
  setUserMenuOpen: (open: boolean) => void;
}

export const UserProfilePopup = ({
  user,
  handleLogout,
  setUserMenuOpen,
}: UserProfilePopupProps) => {
  const userMenuElement = useRef<HTMLDivElement>(null);
  const handleUserMenuBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget === null) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    if (userMenuElement.current) {
      userMenuElement.current.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => setUserMenuOpen(false));
  }, []);

  return (
    <div
      onBlur={handleUserMenuBlur}
      ref={userMenuElement}
      tabIndex={0}
      className="flex flex-col items-center justify-center w-fit absolute -right-16 top-14 bg-black-800 ease-in-out duration-300 opacity-100 overflow-hidden animate-slide-up rounded-lg"
    >
      <div className="flex flex-col p-4 items-center justify-center w-fit">
        <p className="text-white">{user?.name}</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-2 py-0.5 rounded-b-lg bg-red-600 text-white w-full"
      >
        Sign Out
      </button>
    </div>
  );
};
