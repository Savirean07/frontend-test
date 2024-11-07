import { PublicClientApplication } from "@azure/msal-browser";

const helperFunctions = (msalInstance: PublicClientApplication | null) => {
  if (!msalInstance) {
    throw new Error("MsalInstance is null");
  }
  return {
    getToken: async () => {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        window.location.replace("/login");
        return null;
      }
      if (account.idToken) {
        const exp = account.idTokenClaims?.exp
        if (exp && Date.now() / 1000 > exp) {
          return account.idToken;
        }
      }
      const authResult = await msalInstance.acquireTokenSilent({
        account,
        scopes: ["openid", "profile", "email"],
        authority: localStorage.getItem("authority") || "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      });
      const token = authResult.idToken;
      return token;
    },

    getAccessToken: async () => {
      const account = msalInstance.getActiveAccount();
      if (!account) return null;
      const accessToken = await msalInstance.acquireTokenPopup({
        account,
        authority: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        scopes: ["openid", "profile", "email", "Mail.Send"],
      })

      return accessToken;
    },

    getPolicy: () => {
      const account = msalInstance.getActiveAccount();
      const policy = account?.tenantId
      return policy;
    },
    setTokenAndPolicy: (token: string, policy: string) => {
      localStorage.setItem("token", token);
      localStorage.setItem("policy", policy);
    },
  }
};

export default helperFunctions;