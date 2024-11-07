import { useEffect, useState } from "react";

interface IAlert {
    message: string;
    type: "info" | "error" | "success" | "default" | "warning";
}

const useAlert = () => {

    const [alert, setAlert] = useState<IAlert | null>(null);

    const [activeAlert, setActiveAlert] = useState<IAlert | null>(null);

    const hideAlert = () => {
        setAlert(null);
    }

    const setAlwaysActiveAlert = (alert: IAlert) => {
        setActiveAlert(alert);
    }
    const alertContextValue = {
        alert: alert || activeAlert,
        setAlert,
        hideAlert,
        setAlwaysActiveAlert,
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (alert) {
            timeout = setTimeout(() => {
                hideAlert();
            }, 5000);
        }
        return () => {
            clearTimeout(timeout);
        }
    }, [alert]);


    return alertContextValue;
}

export default useAlert;