import React from "react";
import { twMerge } from "tailwind-merge";

interface BobbleAnimationProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  babbleNos?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

const randomNumber = () => Math.ceil(Math.random() * 90);

const babbelKeyframsCaches: {
  [key: string | number]: object;
} = {};

export const colors = {
  0: "bg-red-500",
  1: "bg-blue-500",
  2: "bg-green-500",
  3: "bg-blue-500",
  4: "bg-amber-500",
  5: "bg-pink-500",
  6: "bg-orange-500",
  7: "bg-violet-500",
};

const BobbleAnimation = (props: BobbleAnimationProps) => {
  const { babbleNos = 3 } = props;
  const babblesList = Array.from(Array(babbleNos).keys());
  return (
    <div
      className={twMerge(
        "absolute top-0 left-0 w-full h-full z-0 *:aspect-square *:rounded-full *:animate-bobble *:absolute *:w-72 *:blur-[220px] *:ease-in-out *:duration-300",
        props.className
      )}
    >
      {babblesList.map((_v, i) => {
        if (typeof babbelKeyframsCaches[i] !== "object") {
          babbelKeyframsCaches[i] = {
            "--bobble-x-0": `${randomNumber()}vw`,
            "--bobble-x-1": `${randomNumber()}vw`,
            "--bobble-x-2": `${randomNumber()}vw`,
            "--bobble-x-3": `${randomNumber()}vw`,
            "--bobble-x-4": `${randomNumber()}vw`,
            "--bobble-x-5": `${randomNumber()}vw`,
            "--bobble-y-0": `${randomNumber()}vh`,
            "--bobble-y-1": `${randomNumber()}vh`,
            "--bobble-y-2": `${randomNumber()}vh`,
            "--bobble-y-3": `${randomNumber()}vh`,
            "--bobble-y-4": `${randomNumber()}vh`,
            "--bobble-y-5": `${randomNumber()}vh`,
          };
        }
        const componentInlineStyle = {
          ...babbelKeyframsCaches[i],
        } as React.CSSProperties;
        return (
          <div
            style={componentInlineStyle}
            key={`bobble-${i}`}
            className={`${Object.values(colors)[i]}  opacity-0`}
          ></div>
        );
      })}
    </div>
  );
};

export default BobbleAnimation;
