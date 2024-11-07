import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface plansInterface {
  [key: string]: {
    price: {
      monthly: string | number;
      annually: string | number;
    };
    description: string;
    items: {
      id: string | number;
      isAvailable: boolean;
      title: string;
      description?: string;
    }[];
  };
}

const plans: plansInterface = {
  beginner: {
    price: {
      monthly: "$0",
      annually: "$0",
    },
    description:
      "Free for ever with limited features and limited requests per day",
    items: [
      {
        id: 0,
        isAvailable: true,
        title: "AI-Blog - 2000 Token/day",
        description:
          "AI blog is a argentic blog writer pre defined team which will write blog for you as per your requirement",
      },
      {
        id: 1,
        isAvailable: true,
        title: "AI-Marketing - 2000 Token/day",
        description:
          "AI marketing is a argentic marketing writer pre defined team which will write marketing content for you as per your requirement",
      },
      {
        id: 2,
        isAvailable: true,
        title: "AI-Content-Writer - 2000 Token/day",
        description:
          "AI content writer is a argentic content writer pre defined team which will write content for you as per your requirement",
      },
      {
        id: 3,
        isAvailable: false,
        title: "AI-Social-Media-handler",
        description:
          "AI social media handler is a argentic social media handler pre defined team which will handle social media for you as per your requirement",
      },
      {
        id: 4,
        isAvailable: false,
        title: "AI-Content-Creator",
        description:
          "AI content creator is a argentic content creator pre defined team which will create content for you as per your requirement",
      },
    ],
  },
  pro: {
    price: {
      monthly: "$10",
      annually: "$110",
    },
    description: "Best for small business and freelancers",
    items: [
      {
        id: 0,
        isAvailable: true,
        title: "AI-Blog - 10000 Token/day",
        description:
          "AI blog is a argentic blog writer pre defined team which will write blog for you as per your requirement",
      },
      {
        id: 1,
        isAvailable: true,
        title: "AI-Marketing - 10000 Token/day",
        description:
          "AI marketing is a argentic marketing writer pre defined team which will write marketing content for you as per your requirement",
      },
      {
        id: 2,
        isAvailable: true,
        title: "AI-Content-Writer - 10000 Token/day",
        description:
          "AI content writer is a argentic content writer pre defined team which will write content for you as per your requirement",
      },
      {
        id: 3,
        isAvailable: true,
        title: "AI-Social-Media-handler - 10000 Token/day",
        description:
          "AI social media handler is a argentic social media handler pre defined team which will handle social media for you as per your requirement",
      },
      {
        id: 4,
        isAvailable: true,
        title: "AI-Content-Creator - 10000 Token/day",
        description:
          "AI content creator is a argentic content creator pre defined team which will create content for you as per your requirement",
      },
    ],
  },
  enterprise: {
    price: {
      monthly: "$15",
      annually: "$160",
    },
    description: "Best for large scale business and freelancers",
    items: [
      {
        id: 0,
        isAvailable: true,
        title: "AI-Blog - unlimited Token/day",
        description:
          "AI blog is a argentic blog writer pre defined team which will write blog for you as per your requirement",
      },
      {
        id: 1,
        isAvailable: true,
        title: "AI-Marketing - unlimited Token/day",
        description:
          "AI marketing is a argentic marketing writer pre defined team which will write marketing content for you as per your requirement",
      },
      {
        id: 2,
        isAvailable: true,
        title: "AI-Content-Writer - unlimited Token/day",
        description:
          "AI content writer is a argentic content writer pre defined team which will write content for you as per your requirement",
      },
      {
        id: 3,
        isAvailable: true,
        title: "AI-Social-Media-handler - unlimited Token/day",
        description:
          "AI social media handler is a argentic social media handler pre defined team which will handle social media for you as per your requirement",
      },
      {
        id: 4,
        isAvailable: true,
        title: "AI-Content-Creator - unlimited Token/day",
        description:
          "AI content creator is a argentic content creator pre defined team which will create content for you as per your requirement",
      },
    ],
  },
};

const SubscriptionPlan = () => {
  const [isAnnuallyPlan, setIsAnnuallyPlan] = useState(false);
  return (
    <div className="min-h-screen bg-black p-36 flex flex-col items-center justify-center">
      <div>
        <h1 className="text-5xl font-bold text-center">
          Our Subscription Plans
        </h1>
        <p className="text-center text-black-500 text-xl mt-4">
          Pick an AI Subscription plan that fits your Requirement
        </p>
        <div className="flex gap-4 justify-center items-center mt-4">
          <span className="text-white text-xl font-bold">Monthly</span>
          <div
            onClick={() => setIsAnnuallyPlan((pre: boolean) => !pre)}
            className="w-14 h-4 bg-white rounded-full relative group"
          >
            <div
              className={`w-6 aspect-square rounded-full bg-blue-500 absolute ease-in-out duration-200 group-active:scale-x-105 top-1/2 -translate-y-1/2 ${
                isAnnuallyPlan ? "left-[calc(100%-1.5rem)]" : "left-0"
              }`}
            ></div>
          </div>
          <span className="text-white text-xl font-bold">Annually</span>
        </div>
        <div className="flex gap-4 my-16 justify-center">
          {Object.keys(plans).map((plan, index) => {
            const { price, description, items } = plans[
              plan
            ] as plansInterface[keyof plansInterface];
            return (
              <div
                key={plan + index}
                className={twMerge(
                  "max-w-sm rounded-xl p-12 flex flex-col gap-4",
                  index % 2 === 0
                    ? "border-2 border-gray-900"
                    : "bg-gray-900 scale-105"
                )}
              >
                <div className="grow">
                  <h3 className="text-xl font-bold uppercase mb-2">
                    {plan}
                    <span className="text-gray-600 text-xs">
                      {plan === "pro" && " (Recommended)"}
                    </span>
                  </h3>
                  <p className="text-4xl font-bold text-blue-500 mb-6">
                    {isAnnuallyPlan ? price.annually : price.monthly}{" "}
                    <span className="text-lg">
                      per {isAnnuallyPlan ? "year" : "month"}
                    </span>
                  </p>
                  <p className="text-gray-400 mb-6">{description}</p>
                  <div className="relative flex flex-col gap-2">
                    <ul className="grow">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          aria-hidden={item.isAvailable}
                          className="p-2 relative rounded-md my-0.5 aria-hidden:list-['✔️'] list-['❌'] group"
                        >
                          <p className="text-gray-200">{item.title}</p>
                          {item.description && (
                            <p className="text-gray-400 text-xs group-hover:h-8 h-0 overflow-hidden ease-in-out duration-200">
                              {item.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (plan === "enterprise") {
                      window.open("/contact", "_blank");
                    }
                  }}
                  className={twMerge(
                    "border-2 border-blue-500 w-full rounded-lg p-2 hover:bg-blue-500 hover:text-white",
                    plan === "pro" ? "bg-blue-500" : ""
                  )}
                >
                  {plan === "enterprise" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
