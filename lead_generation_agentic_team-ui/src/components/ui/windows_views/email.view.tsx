import { twMerge } from "tailwind-merge";
import {
  MdCancel,
  MdEdit,
  MdMailOutline,
  MdSave,
  MdSend,
} from "react-icons/md";
import WindowHeader, { IWindowHeaderProps } from "../window.header";
import { TextAnimationProps } from "src/components/animation";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../button";
import { useMsal } from "src/auth";
import {
  ResponseData,
  useEmailGeneratorContext,
} from "src/contexts/email-generator.context";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { URIs } from "src/config";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import tokenHelper from "src/auth/helper";

interface EmailViewProps extends IWindowHeaderProps {
  id: string | number;
  content: string;
  animationProps?: TextAnimationProps;
  icon?: React.ReactNode;
  iconColor?: string;
  time?: string;
  open?: boolean;
  timeline?: ResponseData[];
}

type EmailData = {
  subject: string;
  body: string;
  to: string;
  from?: string;
  cc?: string;
  bcc?: string;
};

const EmailView = ({
  id,
  timeline,
  content,
  icon,
  animationProps,
  iconColor,
  time,
  headingText,
  open,
  ...windowHeaderProps
}: EmailViewProps) => {
  const { msalInstance } = useMsal();
  const [searchParams] = useSearchParams();
  const { generatedEmailHistory } = useEmailGeneratorContext();
  const [isOpen, setIsOpen] = useState(open);
  const [mode, setMode] = useState<"edit" | "send">("send");
  const [mailSendApiStatus, setMailSendApiStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [account] = useState<string[] | undefined>(
    msalInstance?.getActiveAccount()?.idTokenClaims?.emails
  );

  const [isCopied, setIsCopied] = useState(false);
  const [from, setFrom] = useState<AccountInfo | null | undefined>(
    msalInstance?.getActiveAccount()
  );
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const oldVersion = useRef<EmailData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const bodyInputRef = useRef<HTMLTextAreaElement>(null);

  const sendEmail = async () => {
    const { accessToken, idToken } = (await tokenHelper(
      msalInstance
    ).getAccessToken()) as AuthenticationResult;
    if (!accessToken) {
      setMailSendApiStatus("idle");
      return alert("Failed to get access token, Please login again");
    }
    setMailSendApiStatus("loading");
    try {
      const bodyData: {
        recipient: string[];
        ccRecipient: string[];
        bccRecipient: string[];
        subject: string;
        body: string;
        from: string;
      } = {
        recipient: to.length > 0 ? to.split(/[ ,]+|;|,/) : [],
        bccRecipient: bcc.length > 0 ? bcc.split(/[ ,]+|;|,/) : [],
        ccRecipient: cc.length > 0 ? cc.split(/[ ,]+|;|,/) : [],
        subject,
        body,
        from: accessToken,
      };
      if (bodyData.recipient.length <= 0) {
        alert("no recipient");
        setMailSendApiStatus("idle");
        return;
      }
      const response = await axios.post(
        URIs.API_URL + "/mail-manager/send",
        bodyData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (response.status === 202) {
        setMailSendApiStatus("success");
        alert("Email sent successfully");
      } else {
        setMailSendApiStatus("error");
        alert("Failed to send email \n" + response.data.data);
      }
    } catch (error: any) {
      console.log(error);
      setMailSendApiStatus("error");
      alert("Failed to send email \n" + error.message);
    }
  };

  useEffect(() => {
    const subject = /Subject: (.*)/i.exec(content)?.[1] || "";
    setSubject(subject);
    const to = /To: (.*)/i.exec(content)?.[1] || "";
    setTo(to);
    const cc = /Cc: (.*)/i.exec(content)?.[1] || "";
    setCc(cc);
    const bcc = /Bcc: (.*)/i.exec(content)?.[1] || "";
    setBcc(bcc);
    const message = content.split(subject)[1]?.trim() || "";
    setBody(message);
    generatedEmailHistory.update(id as string, {
      subject,
      body: message,
      timeline: timeline,
    });
  }, []);
  useEffect(() => {
    if (bodyInputRef.current) {
      const { scrollHeight } = bodyInputRef.current;
      bodyInputRef.current.style.minHeight = `${scrollHeight}px`;
    }
    setMode("send");
  }, [isOpen]);

  useEffect(() => {
    if (mode === "edit") {
      oldVersion.current = {
        to,
        cc,
        bcc,
        subject,
        body,
      };
    }
    const clientSessionID = searchParams.get("clientSessionID");
    if (!clientSessionID) return;
    generatedEmailHistory.update(clientSessionID as string, {
      subject,
      body,
      timeline: timeline,
    });
  }, [mode]);
  useEffect(() => {
    setIsCopied((prev) => !prev);
  }, [body, to, cc, bcc, subject, from]);

  useEffect(() => {
    if (mode === "edit") {
      bodyInputRef.current?.focus();
    }
  }, [mode]);

  return (
    <>
      <div className="flex flex-row justify-center items-start gap-2 self-start max-w-[calc(100%-42px)] w-full animate-grow-x">
        <div className="flex flex-col justify-center items-center gap-2 relative self-stretch">
          <span
            className={twMerge(
              "text-xl rounded-full p-2 bg-black/50 relative",
              iconColor
            )}
          >
            {icon ? icon : <MdMailOutline />}

            <span
              className={twMerge(
                "absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-1",
                iconColor
              )}
            ></span>
          </span>
          <div className={twMerge("w-1 h-full -mt-2", iconColor)}></div>
        </div>
        <div
          className={twMerge(
            "w-full mb-4 ease-in-out duration-300",
            isOpen && mode === "edit"
              ? "absolute top-0 left-0 w-full h-full backdrop-blur-2xl p-4 z-50 overflow-auto scrollbar-hidden flex flex-col items-center"
              : ""
          )}
        >
          <div
            className={twMerge(
              "w-full flex flex-col justify-center items-center border-green-500/10 rounded-xl border ease-in-out duration-300",
              "text-white bg-black/50",
              isOpen && mode === "edit" ? " max-w-7xl w-full" : ""
            )}
          >
            <WindowHeader
              {...windowHeaderProps}
              headingText={
                mode === "send" ? headingText : "editing mode (" + subject + ")"
              }
              isOpen={isOpen}
              disableClose={mode === "edit"}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              isCopied={isCopied}
              onCopy={() =>
                navigator.clipboard.writeText(
                  `From: ${account}\nTo: ${to}\nCc: ${cc}\nBcc: ${bcc}\n\nSubject: ${subject}\n\n${body}`
                )
              }
              buttonsNode={
                <>
                  <IconButton
                    text={mode === "edit" ? "Save" : "Edit"}
                    icon={
                      mode === "send" ? (
                        <MdEdit size={14} />
                      ) : (
                        <MdSave size={14} />
                      )
                    }
                    color={mode === "send" ? "white" : "green"}
                    onClick={() => setMode(mode === "edit" ? "send" : "edit")}
                  />
                  {mode === "send" && (
                    <IconButton
                      text={
                        mailSendApiStatus === "loading" ? "Sending..." : "Send"
                      }
                      icon={
                        mailSendApiStatus !== "loading" && <MdSend size={14} />
                      }
                      color="yellow"
                      onClick={sendEmail}
                      disabled={
                        msalInstance?.getActiveAccount()?.environment !==
                          "login.microsoftonline.com" ||
                        mailSendApiStatus === "loading" || to.length < 1 ||
                        to.split(/[ ,]+|;|,/).length <= 0
                      }
                      title={
                        msalInstance?.getActiveAccount()?.environment !==
                          "login.microsoftonline.com"
                          ? "Please login to your Microsoft account"
                          : mailSendApiStatus === "loading"
                          ? "Email is already sending"
                          : to.length <= 0
                          ? "Please enter recipient email"
                          : ""
                      }
                    />
                  )}
                  {mode === "edit" && (
                    <IconButton
                      text="Discard"
                      icon={<MdCancel size={14} />}
                      color="red"
                      onClick={() => {
                        setMode("send");
                        setSubject(oldVersion.current.subject);
                        setTo(oldVersion.current.to);
                        setCc(oldVersion.current.cc || "");
                        setBcc(oldVersion.current.bcc || "");
                        setBody(oldVersion.current.body || "");
                      }}
                    />
                  )}
                </>
              }
            >
              {isOpen && (
                <div className={twMerge("w-full", isOpen ? "p-4" : "p-0")}>
                  <form className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full mb-4">
                      <label
                        className={twMerge(
                          "rounded-md px-4 py-1.5 text-sm text-white/80",
                          "bg-black-800/50"
                        )}
                      >
                        From
                      </label>
                      {msalInstance
                        ?.getAllAccounts()
                        ?.some(
                          (account) =>
                            account.environment === "login.microsoftonline.com"
                        ) ? (
                        <select
                          className="border border-white/10 rounded-md px-2 py-1 text-sm bg-transparent  placeholder:text-white/20 outline-none"
                          onChange={(e) =>
                            setFrom(
                              msalInstance
                                ?.getAllAccounts()
                                ?.find(
                                  (account) =>
                                    account?.username === e.target.value
                                )
                            )
                          }
                          value={from?.username}
                        >
                          {msalInstance?.getAllAccounts()?.map((account) => (
                            <option
                              key={account?.username}
                              value={account?.username}
                              selected={account?.username === from?.username}
                            >
                              {account?.username}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-red-500 text-sm flex flex-row items-center gap-2 mt-1 mr-2 bg-red-500/10 rounded-md p-2">
                          No Microsoft account found
                        </p>
                      )}
                      {/* <div className="flex flex-row items-center justify-center gap-2 mt-1 mr-2">
                        <IconButton
                          text="Add New Account"
                          color="green"
                          onClick={() =>
                           console.log(msalInstance?.getAllAccounts())
                          }
                        />
                      </div> */}
                    </div>
                    <InputField
                      label="To"
                      value={to}
                      onChange={(value) => setTo(value)}
                      placeholder="someone@example.com"
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      id="to"
                      required
                      type="email"
                    />
                    <InputField
                      label="Cc"
                      value={cc}
                      onChange={(value) => setCc(value)}
                      placeholder="someone@example.com"
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      id="cc"
                      required
                      type="email"
                    />
                    <InputField
                      label="Bcc"
                      value={bcc}
                      onChange={(value) => setBcc(value)}
                      placeholder="someone@example.com"
                      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      id="bcc"
                      required
                      type="email"
                    />
                    <InputField
                      label="Subject"
                      value={subject}
                      onChange={(value) => setSubject(value)}
                      placeholder="subject"
                      id="subject"
                      type="text"
                      required
                      className="mt-4"
                      readOnly={mode !== "edit"}
                    />
                    <textarea
                      ref={bodyInputRef}
                      rows={20}
                      onChange={(e) => setBody(e.target.value)}
                      id="message"
                      value={body}
                      readOnly={mode !== "edit"}
                      className={twMerge(
                        "border h-full border-white/10 rounded-md px-2 py-1 text-sm bg-transparent flex-1 placeholder:text-white/20 outline-none scrollbar-hidden",
                        mode === "edit" ? "focus:border-white/50" : ""
                      )}
                      placeholder="message..."
                    />
                  </form>
                </div>
              )}
            </WindowHeader>
          </div>
          <div className="flex flex-row items-center justify-end gap-2 mt-1 mr-2 self-end">
            <p className="text-xs text-white/50 flex flex-row items-center gap-2">
              {time}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailView;

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  pattern,
  id,
  type,
  className,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  pattern?: string;
  id: string;
  type: React.HTMLInputTypeAttribute;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}) => {
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(value);

  const handleChange = (value: string) => {
    if (rest.readOnly) return;
    setData(value);
    onChange(value);
    setHasError(!checkPattern(value, pattern, / |, |,|;/g));
  };

  useEffect(() => {
    setData(value);
  }, [value]);
  return (
    <div className={twMerge("flex gap-2 w-full", className)}>
      <label
        className="rounded-md px-4 py-1.5 text-sm text-white/80 bg-black-800/50"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={twMerge(
          "border border-white/10 rounded-md px-2 py-1 text-sm bg-transparent flex-1 placeholder:text-white/20 outline-none",
          hasError && data.length > 0 ? "border-red-500" : ""
        )}
        {...rest}
        id={id}
        type={type}
        placeholder={placeholder}
        pattern={pattern}
        value={data}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

const checkPattern = (
  value: string,
  pattern?: string,
  splitExpression?: RegExp
) => {
  if (!pattern) return true;
  if (splitExpression) {
    const split = value.split(splitExpression);
    return split.every((value) => new RegExp(pattern).test(value));
  }
};
