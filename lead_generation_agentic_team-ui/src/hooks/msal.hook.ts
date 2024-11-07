import { useEffect, useState } from "react";
import { useMsal } from "src/auth";

export const useMsalAuthority = () => {
    const { authority } = useMsal();
    const [authorizedAuthority, setAuthorizedAuthority] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [policy, setPolicy] = useState<string | null>(null);

    const getAuthority = () => {
        return window.localStorage.getItem("authority");
    };

    const setTokenAndPolicy = (token: string, policy: string) => {
        setToken(token);
        setPolicy(policy);
    };

    useEffect(() => {
        if (authority) {
            setAuthorizedAuthority(authority);
        }
    }, [authority]);

    useEffect(() => {
        if (!authority && !authorizedAuthority) {
            setAuthorizedAuthority(getAuthority());
        }
    }, []);

    const setAuthority = (authority: string) => {
        if (authority) {
            window.localStorage.setItem("authority", authority);
            setAuthorizedAuthority(authority);
        }
    };

    return { authority: authorizedAuthority, setAuthority, token, policy, setTokenAndPolicy };
};