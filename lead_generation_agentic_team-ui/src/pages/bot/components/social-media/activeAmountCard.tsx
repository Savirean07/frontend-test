import React from "react";
import { IoShare } from "react-icons/io5";
import { PiPlugsConnectedFill } from "react-icons/pi";

/**
 * The props for the `ActiveAccountCard` component.
 */
interface ActiveAccountCardProps {
  /**
   * The icon component for the social media.
   */
  SocialIcon: React.ComponentType<{ size: number }>;

  /**
   * The account ID or username for the social media account.
   */
  accountId: string;

  /**
   * The name of the social media platform.
   */
  socialMediaName: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "google" | "github" | "whatsapp" | "apple";
}

const socialMediaColorsClasses: Record<ActiveAccountCardProps['socialMediaName'], string> = {
  facebook: "group-hover/list:text-social-facebook",
  instagram: "group-hover/list:text-social-instagram",
  linkedin: "group-hover/list:text-social-linkedin",
  twitter: "group-hover/list:text-social-twitter",
  youtube: "group-hover/list:text-social-youtube",
  google: "group-hover/list:text-social-google",
  github: "group-hover/list:text-social-github",
  whatsapp: "group-hover/list:text-social-whatsapp",
  apple: "group-hover/list:text-social-apple",
};

/**
 * Displays a card for an active social media account.
 * @param props - The props for the `ActiveAccountCard` component.
 * @returns JSX.Element
 */
export const ActiveAccountCard: React.FC<ActiveAccountCardProps> = ({ SocialIcon, accountId, socialMediaName }) => {
  return (
    <li className="hover:bg-black-900 bg-black-800 group/list text-black-50 p-4 flex justify-between items-center border-b border-black-900 ease-in-out duration-200  first:border-b last:border-t last:rounded-b-lg">
      <p className={`flex gap-2 items-center font-cascade ${socialMediaColorsClasses[socialMediaName]}`}>
        <SocialIcon size={28} />
        <span>{accountId}</span>
      </p>
      <button className="group-hover/list:flex hidden group/share hover:bg-black-800 px-3 py-1 rounded-full gap-2 items-center cursor-pointer">
        <p>
          <IoShare />
        </p>
        <p className="w-0 group-hover/share:w-9 text-sm overflow-hidden ease-in-out duration-500">
          Share
        </p>
      </button>
    </li>
  );
};


/**
 * The props for the `NotConnectedAccountCard` component.
 */
interface NotConnectedAccountCardProps {
  /**
   * The icon component for the social media.
   */
  SocialIcon: React.ComponentType<{ size: number }>;

  /**
   * The name of the social media platform.
   */
  socialMediaName: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "google" | "github" | "whatsapp" | "apple";
}

export const NotConnectedAccountCard: React.FC<NotConnectedAccountCardProps> = ({ SocialIcon, socialMediaName }) => {
  return (
    <li className="hover:bg-black-900 bg-black-800 group/list text-black-50 p-4 flex justify-between items-center border-b border-black-900 ease-in-out duration-200 last:border-none last:rounded-b-lg">
      <p className={`flex gap-2 items-center font-cascade ${socialMediaColorsClasses[socialMediaName]}`}>
        <SocialIcon size={28} />
        <span>{socialMediaName}</span>
      </p>
      <button className="group-hover/list:flex hidden group/share hover:bg-black-800 px-3 py-1 rounded-full gap-1 items-center cursor-pointer">
        <p>
          <PiPlugsConnectedFill />
        </p>
        <p className="w-0 group-hover/share:w-14 text-sm overflow-hidden ease-in-out duration-500">
          Connect
        </p>
      </button>
    </li>
  );
};
