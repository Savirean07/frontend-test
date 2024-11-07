import { IconType } from "react-icons";
import { MdAnalytics, MdEmail, MdGeneratingTokens } from "react-icons/md";
import { colors } from "src/pages/home/components/bobbleAnimation";

interface Button {
    text: string;
    link: string;
}

interface LeadGenerationRole {
    id: number | string;
    title: string;
    tag_line: string;
    tags?: string[];
    description: string;
    button: Button[];
    image_url: string;
    image_alt: string;
    themeColor?: {
        primary?: string,
        secondry?: string
    }
    Icon?: IconType;
}

export const leadGenerationRoles: LeadGenerationRole[] = [
    {
        id: 1,
        title: "Lead Generator",
        tag_line: "Generate leads from the web",
        tags: ["linkedin", "twitter", "facebook"],
        description: `Lead Generator is a tool that allows you to get potential leads from the web. 
        which can be linkedin, twitter, facebook, etc. and summarize the data into a CSV file. 
        and also you can filter the leads by the job title, company name, location and many more.`,
        button: [
            {
                text: "Subscribe now",
                link: "/subscription-plan",
            },
            {
                text: "Generate Leads",
                link: "/roles/lead-generator",
            }
        ],
        image_url: "/image/Designer(1).jpeg",
        image_alt: "Lead Scrapper Team",
        Icon: MdGeneratingTokens,
        themeColor: {
            primary: colors[0].replace(/bg/, "text"),
            secondry: colors[1].replace(/bg/, "text")
        }
    },
    {
        id: 2,
        title: "Profile Analyst",
        tag_line: "Analyze Linkedin Profiles",
        tags: ["linkedin", "twitter", "facebook"],
        description: "Profile Analyst is a tool that allows you to analyze the Linkedin profiles and get the enriched profile data into a CSV file.",
        button: [
            {
                text: "Subscribe now",
                link: "/subscription-plan",
            },
            {
                text: "Analyze Profile",
                link: "/roles/profile-analyst",
            }
        ],
        image_url: "/image/Designer.jpeg",
        image_alt: "Analyze Profile",
        Icon: MdAnalytics,
        themeColor: {
            primary: colors[1].replace(/bg/, "text"),
            secondry: colors[2].replace(/bg/, "text")
        }
    },
    {
        id: 3,
        title: "Mail Composer",
        tag_line: "Write custom emails for your leads",
        tags: ["Email", "Cold Email", "Outreach", "Linkedin", "Twitter", "Facebook", "scrape"],
        description: "Mail Composer is a tool that allows you to write custom emails for the potential leads.",
        button: [
            {
                text: "Subscribe now",
                link: "/subscription-plan",
            },
            {
                text: "Compose Mail",
                link: "/roles/mail-composer",
            }
        ],
        image_url: "/image/Designer(4).jpeg",
        image_alt: "Compose Mail",
        Icon: MdEmail,
        themeColor: {
            primary: colors[2].replace(/bg/, "text"),
            secondry: colors[3].replace(/bg/, "text")
        }
    }
];