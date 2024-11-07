export interface LogData {
  message: string;
  type: string;
  userId: string;
  level: string;
  title: string;
  description: string;
  id: number;
  timeStamp: Date;
}

export const sendLogToServer = async () => {
  try {
    // const response = await fetch(`${apiEndPoints.ADDNOTIFICATION}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(logData),
    // });
    // const data = await response.json() as { message: string, success: boolean, data: { message: string } };
    // return data;
  } catch (error) {
    console.error(error);
    return { message: "Error sending log to server", success: false, data: null };
  }
};
