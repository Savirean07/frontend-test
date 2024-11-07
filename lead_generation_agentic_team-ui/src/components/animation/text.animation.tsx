import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export type TextAnimationProps = {
  className?: string;
  children?: React.ReactNode;
  text: string;
  speed?: number;
  delay?: number;
  duration?: number;
  animate?: boolean;
  parentHidden?: boolean;
  pace?: number;
  Icon?: IconType;
  contentRenderer?: (props: { text: string }) => JSX.Element;
};

const TextAnimation: React.FC<TextAnimationProps> = ({
  className,
  text,
  speed = 20,
  delay = 0,
  duration,
  animate = true,
  parentHidden = false,
  pace = 1,
  Icon,
  contentRenderer,
  children,
}) => {
  const [charIndex, setCharIndex] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null); // Store the animation frame ID
  const startTimeRef = useRef<number | null>(null); // Track the start time for controlling the pace

  const totalTextLength = text.length;
  const animationDuration = duration ? duration / totalTextLength : speed;

  useEffect(() => {
    if (!animate || totalTextLength === 0) return;

    const animateText = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed >= animationDuration) {
        setCharIndex((prev) => {
          if (prev < totalTextLength) {
            return prev + pace;
          } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return prev;
          }
        });
        startTimeRef.current = timestamp; // Reset start time for the next frame
      }

      requestRef.current = requestAnimationFrame(animateText);
    };

    const timeoutId = setTimeout(() => {
      requestRef.current = requestAnimationFrame(animateText);
    }, delay);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      clearTimeout(timeoutId);
    };
  }, [animate, delay, animationDuration, pace, totalTextLength]);

  // Handle parent element visibility during animation
  useEffect(() => {
    if (parentHidden && parentRef.current?.parentElement) {
      parentRef.current.parentElement.style.opacity = charIndex > 0 ? "1" : "0";
    }
  }, [charIndex, parentHidden]);

  // Use custom renderer if provided
  if (contentRenderer) {
    return contentRenderer({
      text: animate
        ? typeof text === "string"
          ? text?.slice(0, charIndex)
          : text
        : text,
    });
  }

  return (
    <span
      ref={parentRef}
      className={twMerge("relative flex items-center", className)}
    >
      {Icon && (
        <span className="mr-2 inline-block bg-blue-100 p-1 rounded-md">
          <Icon />
        </span>
      )}
      {animate ? text?.toString().slice(0, charIndex) : text}
      {children}
    </span>
  );
};

export default TextAnimation;
