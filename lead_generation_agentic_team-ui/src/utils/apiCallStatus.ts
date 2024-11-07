export interface IApiCallStatus {
  IDLE: string;
  LOADING: string;
  SUCCESS: string;
  ERROR: string;
  NO_INTERNET: string;
  NO_DATA: string;
  INITIAL: string;
  IN_PROGRESS: string;
}

export type IprogressStatus = "idle" | "in_progress" | "success" | "error" | "waiting" | "initial" | "close" | "connection_error" | "in_progress_new_env";

export const apiCallStatus: IApiCallStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  NO_INTERNET: "no_internet",
  NO_DATA: "no_data",
  INITIAL: "initial",
  IN_PROGRESS: "in_progress",
};
