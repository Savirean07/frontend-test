import { IconType } from "react-icons";
import { MdAnalytics, MdEmail, MdGeneratingTokens } from "react-icons/md";

export interface SubPath {
    id: string;
    name: string;
    path: string;
    Icon?: IconType;
    target?: "_blank" | "_self";
    description?: string;
    color?: {
        text: string;
        bg: string;
    };
}

export interface Route {
    id: string;
    name: string;
    path: string;
    subPath?: SubPath[];
    Icon?: IconType;
    target?: "_blank" | "_self";
    color?: {
        text: string;
        bg: string;
    };
}

export const routes: Route[] = [
    {
        id: "1",
        name: "Home",
        path: "",
    },
    {
        id: "2",
        name: "About_Us",
        path: "about",
    },
    // {
    //     id: "3",
    //     name: "Blog",
    //     path: "blog",
    //     subPath: [
    //         {
    //             id: "1",
    //             name: "Blogging-Teams",
    //             path: "blog/AI-blog",
    //         },
    //         {
    //             id: "2",
    //             name: "Marketing-Teams",
    //             path: "blog/AI-marketing",
    //         },
    //         {
    //             id: "3",
    //             name: "Research-Teams",
    //             path: "blog/AI-chatbot",
    //         },
    //     ],
    // },
    {
        id: "4",
        name: "Roles",
        path: "roles",
        subPath: [
            {
                id: "1",
                name: "Lead Generator",
                path: "roles/lead-generator",
                Icon: MdGeneratingTokens,
                color: {
                    text: "text-red-500",
                    bg: "bg-red-500",
                },
                description: `Lead Generator is a tool that allows you to get potential leads from the web. 
                which can be linkedin, twitter, facebook, etc. and summarize the data into a CSV file. 
                and also you can filter the leads by the job title, company name, location and many more.`,
            },
            {
                id: "2",
                name: "Profile Analyst",
                path: "roles/profile-analyst",
                Icon: MdAnalytics,
                color: {
                    text: "text-blue-500",
                    bg: "bg-blue-500",
                },
                description: `Profile Analyst is a tool that allows you to analyze the Linkedin profiles and get the enriched profile data into a CSV file.`,
            },
            {
                id: "3",
                name: "Mail Composer",
                path: "roles/mail-composer",
                Icon: MdEmail,
                color: {
                    text: "text-green-500",
                    bg: "bg-green-500",
                },
                description: `Mail Composer is a tool that allows you to write custom emails for the potential leads.`,
            }
        ]
    },
    { id: "5", name: "Plans", path: "subscription-plan" },
    {
        id: "6",
        name: "Contact_Us",
        path: "contact",
    },
];