import Markdown from "react-markdown";
import { TextAnimation, TextAnimationProps } from "../animation";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdCheckCircleOutline, MdContentCopy } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { ReactNode, useState } from "react";
import { IconButton } from "./button";

type MarkdownToHTMLProps = {
  animationProps?: TextAnimationProps;
  buttons?: ReactNode;
};

const MarkdownToHTML = ({ animationProps, buttons }: MarkdownToHTMLProps) => {
  return (
    <TextAnimation
      text={animationProps?.text || ""}
      duration={500}
      pace={15}
      {...animationProps}
      contentRenderer={({ text }) => (
        <Markdown
          className={twMerge(
            "min-h-fit no-tailwind",
            animationProps?.className
          )}
          components={{
            code: (props) => {
              const [isCopied, setIsCopied] = useState(false);
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <>
                  <div className="absolute h-9 top-0 left-0 text-white/50 text-xs rounded-md px-2 py-1 flex flex-row justify-between items-center group !m-0 w-full">
                    <span className="text-sm">{match[1]}</span>
                    <div className="flex gap-2">
                      {buttons ?? buttons}
                      <IconButton
                        text={isCopied ? "Copied" : "Copy"}
                        icon={
                          isCopied ? (
                            <MdCheckCircleOutline />
                          ) : (
                            <MdContentCopy />
                          )
                        }
                        color={isCopied ? "green" : "yellow"}
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(String(children));
                          } else {
                            console.error("Clipboard not supported");
                          }
                          setIsCopied(true);
                          setTimeout(() => {
                            setIsCopied(false);
                          }, 5000);
                        }}
                      />
                    </div>
                  </div>
                  <SyntaxHighlighter
                    {...rest}
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    wrapLines={true}
                    wrapLongLines={true}
                    showInlineLineNumbers={true}
                    lineNumberStyle={{
                      color: "white",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                    lineNumberContainerStyle={{
                      color: "white",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                    ref={undefined}
                    style={atomOneDark}
                    customStyle={{
                      backgroundColor: "rgba(25,25,0,0.1)",
                      padding: "16px",
                      margin: "0px",
                      borderRadius: "0px",
                      borderTop: "1px solid #282828",
                      overflow: "auto",
                      maxHeight: "calc(100vh - 230px)",
                    }}
                  />
                </>
              ) : (
                <code
                  {...props}
                  className={twMerge(className, "overflow-auto")}
                >
                  {children}
                </code>
              );
            },
            pre: ({ node, className, ...props }) => {
              return (
                <pre
                  className="!bg-black !rounded-md !pt-9 !relative !m-0 !p-0"
                  {...props}
                >
                  {props.children}
                </pre>
              );
            },
            p: ({ node, className, ...props }) => {
              return (
                <p className="first:mt-0 last:mb-0" {...props}>
                  {props.children}
                </p>
              );
            },
          }}
        >
          {text}
        </Markdown>
      )}
    />
  );
};

export default MarkdownToHTML;
