import React, { createContext, useContext } from "react";

type ResponseStatus = "pending" | "error" | "in_progress" | "completed" | "initial";

export type ResponseData = {
    id: string | number,
    agent?: string | null;
    report_to?: string | null;
    next_speaker?: string | null;
    requested_to?: "bot" | "admin" | null | string;
    content: string | null;
    response_type: "report" | "email" | "final_email" | "terminated" | "prompt" | "research_report" | "search_parameters";
    status?: "in_progress" | "waiting" | "completed" | null | string;
    timestamp?: number;
};

interface IResponseData {
    response: ResponseData[];
    setResponse: (data: ResponseData[]) => void;
    handleStartRoleResponse: (data: string) => void;
    handleEndRoleResponse: () => void;
    handleResponedRoleResponse: (id: string | number, data: string) => void;
    prompt: string;
    setPrompt: (data: string) => void;
    loadingStatus: ResponseStatus | "initial";
    setLoadingStatus: (data: ResponseStatus | "initial") => void;
}

export interface IFileData {
    id: string | number;
    extension?: string;
    data?: unknown;
    name?: string;
    location?: "local" | "server";
    last_modified?: number;
    created_at?: number;
    owner?: string;
    file_type?: "document" | "image" | "video" | "audio" | "other";
    file_size?: number;
}

interface IPromptRequest {
    submitPromptRequest: (data: any) => void;
}

interface IAdminPromptResponse {
    submitAdminPromptResponse: (id: string | number, data: string) => void;
}

export interface IFileManager {
    files: IFileData[];
    setFiles: (props: IFileData[]) => void;
    handleCloseViewWindow: () => void;
    setOpenAddFileWindow: (props: boolean) => void;
    handleCloseAddFileWindow: () => void;
    openAddFileWindow: boolean;
}

export type EmailHistory = {
    id: string | number;
    subject?: string;
    body?: string;
    timeline?: ResponseData[];
    created_at?: number;
    updated_at?: number;
}

interface IEmailHistory {
    history: EmailHistory[];
    setHistory: React.Dispatch<React.SetStateAction<EmailHistory[]>>;
}

interface ISocketConnection {
    socket?: WebSocket | null;
    isConnected: boolean;
}

interface IHandleSendEmail {
    handleSendEmail: (emailData: {
        subject: string;
        body: string;
        to: string;
        from?: string;
        cc?: string;
        bcc?: string;
    }) => void;
}

const EmailGeneratorContext = createContext<{
    bot: IResponseData;
    promptRequest: IPromptRequest;
    adminPromptResponse: IAdminPromptResponse;
    fileManager: IFileManager;
    emailHistory: IEmailHistory;
    socketConnection: ISocketConnection;
    handleSendEmail: IHandleSendEmail;
}>({
    bot: {
        response: [],
        prompt: "",
        setPrompt: () => { },
        setResponse: () => { },
        handleStartRoleResponse: () => { },
        handleEndRoleResponse: () => { },
        handleResponedRoleResponse: () => { },
        loadingStatus: "initial",
        setLoadingStatus: () => { }
    },
    promptRequest: {
        submitPromptRequest: () => { },
    },
    adminPromptResponse: {
        submitAdminPromptResponse: () => { },
    },
    emailHistory: {
        history: [],
        setHistory: () => { },
    },
    socketConnection: {
        socket: null,
        isConnected: false,
    },
    fileManager: {
        files: [],
        setFiles: () => { },
        handleCloseViewWindow: () => { },
        setOpenAddFileWindow: () => { },
        handleCloseAddFileWindow: () => { },
        openAddFileWindow: false,
    },
    handleSendEmail: {
        handleSendEmail: () => { },
    },
});

export default EmailGeneratorContext;

export const useEmailGeneratorContext = () => {
    const context = useContext(EmailGeneratorContext);
    if (!context) {
        throw new Error("useEmailGeneratorContext must be used within a EmailGeneratorContext");
    }

    const generatedEmailHistory = {
        set: (data: EmailHistory) => {
            if (!data) throw new Error("data is required");
            context.emailHistory.setHistory((prev: EmailHistory[]) => {
                const hasEmail = prev.some((item: EmailHistory) => item.id === data.id);
                if (hasEmail) {
                    return prev.map((item: EmailHistory) => {
                        if (item.id === data.id) {
                            return data;
                        }
                        return item;
                    });
                }
                return [...prev, data];
            });
        },
        update: (id: string | number, data: Omit<EmailHistory, "id" | "created_at" | "updated_at">) => {
            context.emailHistory.setHistory((prev: EmailHistory[]) => {
                return prev.map((item: EmailHistory) => {
                    if (item.id === id) {
                        return { ...item, ...data, updated_at: Date.now() };
                    }
                    return item;
                });
            });
        },
        get: (id: string | number) => {
            return context.emailHistory.history.find((item: EmailHistory) => item.id === id);
        },
        delete: (id: string | number) => {
            context.emailHistory.setHistory((prev: EmailHistory[]) => {
                return prev.filter((item: EmailHistory) => item.id !== id);
            });
        },
        clear: () => {
            context.emailHistory.setHistory([]);
        },
        all: () => {
            return context.emailHistory.history;
        }
    }
    return { ...context, generatedEmailHistory };
}