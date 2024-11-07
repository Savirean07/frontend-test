import { createContext } from "react";

type ResponseCategory = "bot" | "local" | "admin";

export type ResponseData = { id: string | number, status?: string; content?: string; agent?: string; report_to?: string, response_type?: string, category?: ResponseCategory, timestamp?: number };

interface IFileData {
    id: string | number;
    extension: string;
    data: unknown;
    name?: string;
    location?: "local" | "server";
    last_modified?: number;
    created_at?: number;
    owner?: string;
    file_type?: "document" | "image" | "video" | "audio" | "other";
    file_size?: number;
}

interface IResponseData {
    roleResponse: ResponseData[];
    setRoleResponse: (data: ResponseData[]) => void;
}

interface IPromptRequest {
    submitPromptRequest: (data: any) => void;
}

interface IAdminPromptResponse {
    submitAdminPromptResponse: (data: any, id: string | number) => void;
}

export interface IFileManager {
    addFile: (props: IFileData) => void;
    removeFile: (id: string | number) => void;
    openViewWindow: (id: string | number) => void;
    closeViewWindow: (id: string | number) => void;
    openAddFileWindow: () => void;
    closeAddFileWindow: () => void;
    activeViewWindow?: IFileData;
    storedFileData: IFileData[];
    isViewWindowOpen: boolean;
    isAddFileWindowOpen: boolean;
}

export const EmailGeneratorContext = createContext<{
    roleResponse: IResponseData;
    promptRequest: IPromptRequest;
    adminPromptResponse: IAdminPromptResponse;
    fileManager: IFileManager;
    activeViewWindow?: IFileData;
}>({
    roleResponse: {
        roleResponse: [],
        setRoleResponse: () => { },
    },
    promptRequest: {
        submitPromptRequest: () => { },
    },
    adminPromptResponse: {
        submitAdminPromptResponse: () => { },
    },
    fileManager: {
        addFile: () => { },
        removeFile: () => { },
        openViewWindow: () => { },
        closeViewWindow: () => { },
        openAddFileWindow: () => { },
        closeAddFileWindow: () => { },
        storedFileData: [],
        isViewWindowOpen: false,
        isAddFileWindowOpen: false,
    },
});