import {
  Configuration,
  PopupRequest,
  INavigationClient,
  NavigationOptions,
} from "@azure/msal-browser";
import { NavigateFunction } from "react-router-dom";
import { URIs } from "src/config";

const redirectUri = "/";
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0;

export const authorityObject = {
  b2c_1_google_sign_in_up:
    `https://wintellisysmarketingwingman.b2clogin.com/${URIs.auth_config.APP_ID_URI}/b2c_1_google_sign_in_up`,
  b2c_1_email_sign_in:
    `https://wintellisysmarketingwingman.b2clogin.com/${URIs.auth_config.APP_ID_URI}/B2C_1_email_sign_in`,
  b2c_1_microsoft_sign_in:
    `https://login.microsoftonline.com/${URIs.auth_config.TENET_ID}/oauth2/v2.0/authorize`,
};

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    knownAuthorities: [
      `login.microsoftonline.com`,
      `wintellisysmarketingwingman.b2clogin.com`,
    ]
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: isIE || isEdge || isFirefox,
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
    // loggerOptions: {
    //   loggerCallback: (
    //     level: LogLevel,
    //     message: string,
    //     containsPii: boolean
    //   ) => {
    //     if (containsPii) {
    //       return;
    //     }
    //     switch (level) {
    //       case LogLevel.Error:
    //         console.error(message);
    //         return;
    //       case LogLevel.Info:
    //         console.info(message);
    //         return;
    //       case LogLevel.Verbose:
    //         console.debug(message);
    //         return;
    //       case LogLevel.Warning:
    //         console.warn(message);
    //         return;
    //       default:
    //         return;
    //     }
    //   },
    // },
  }
};

export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
  prompt: "login",
  authority:
    `https://wintellisysmarketingwingman.b2clogin.com/${URIs.auth_config.APP_ID_URI}/B2C_1_email_sign_in`,
  redirectUri: redirectUri,
};

export const loginWithGoogleRequest: PopupRequest = {
  scopes: ["openid", "profile", "email"],
  authority:
    `https://wintellisysmarketingwingman.b2clogin.com/${URIs.auth_config.APP_ID_URI}/b2c_1_google_sign_in_up`,
  redirectUri: redirectUri,
};

export const loginWithMicrosoftRequest: PopupRequest = {
  scopes: ['openid', 'profile', "offline_access", 'User.Read', 'email', "Mail.Send"],
  authority: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
  redirectUri: redirectUri,
};

export const signUpRequest: PopupRequest = {
  scopes: ["openid"],
  prompt: "login",
  authority:
    `https://wintellisysmarketingwingman.b2clogin.com/${URIs.auth_config.APP_ID_URI}/b2c_1_email_sign_up`,
  redirectUri: redirectUri,
  nonce: "defaultNonce",
  extraQueryParameters: {
    p: "B2C_1_email_sign_up",
  },
};

export class CustomNavigation implements INavigationClient {
  private navigate: NavigateFunction;
  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }
  async navigateInternal(
    url: string,
    options: NavigationOptions
  ): Promise<boolean> {
    const relativePath = url.replace(window.location.origin, "");
    if (options.noHistory) {
      this.navigate(relativePath, { replace: true });
    } else {
      window.location.href = relativePath;
    }

    return false;
  }
  async navigateExternal(url: string): Promise<boolean> {
    const relativePath = url.replace(window.location.origin, "");
    window.location.href = relativePath;
    return false;
  }
}

export const msalErrorCodes = {
  interactionRequired: "interaction_required",
  loginRequired: "login_required",
  consentRequired: "consent_required",
  invalidGrant: "invalid_grant",
  invalidRequest: "invalid_request",
  invalidScope: "invalid_scope",
  unauthorizedClient: "unauthorized_client",
  accessDenied: "access_denied",
  unsupportedResponseType: "unsupported_response_type",
  serverError: "server_error",
  temporarilyUnavailable: "temporarily_unavailable",
  clientError: "client_error",
  networkError: "network_error",
  tokenRenewalError: "token_renewal_error",
  authorityValidationError: "authority_validation_failed",
  unknownError: "unknown_error",
};

export const graphApiEndpoints = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  graphEventsEndpoint: "https://graph.microsoft.com/v1.0/me/events",
  graphContactsEndpoint: "https://graph.microsoft.com/v1.0/me/contacts",
  graphFilesEndpoint: "https://graph.microsoft.com/v1.0/me/drive/root/children",
  graphProfileEndpoint: "https://graph.microsoft.com/v1.0/me/profile",
  graphPhotosEndpoint: "https://graph.microsoft.com/v1.0/me/photos",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphCalenderEndpoint: "https://graph.microsoft.com/v1.0/me/calendar",
  graphTasksEndpoint: "https://graph.microsoft.com/v1.0/me/tasks",
  graphNotesEndpoint: "https://graph.microsoft.com/v1.0/me/notes",
  graphDriveEndpoint: "https://graph.microsoft.com/v1.0/me/drive",
  graphMailFoldersEndpoint: "https://graph.microsoft.com/v1.0/me/mailFolders",
  graphMailFolderByIdEndpoint: "https://graph.microsoft.com/v1.0/me/mailFolders/{id}",
  graphMailFolderByIdMessagesEndpoint: "https://graph.microsoft.com/v1.0/me/mailFolders/{id}/messages",
  graphMailFolderByIdMessagesByIdEndpoint: "https://graph.microsoft.com/v1.0/me/mailFolders/{id}/messages/{id}",
};