const socketUrl = new window.URL(import.meta.env.VITE_API_URI);

export const URIs = {
  API_URL: import.meta.env.VITE_API_URI,
  SOCKET_PATH: socketUrl.pathname.length > 1 ? socketUrl.pathname + "/socket.io" : "/socket.io",
  SOCKET_URL: socketUrl.origin,
  http_endpoints: {
    file_manager: "/api/file-manager",
  },
  websocket_endpoints: {
    role_lead_generator: "/ws/role/lead-generator",
    role_profile_analyst: "/ws/role/profile-analyst",
    role_mail_composer: "/ws/role/mail-composer",
  },
  auth_config: {
    TENET_ID: import.meta.env.VITE_TENET_ID,
    APP_ID_URI: import.meta.env.VITE_APP_ID_URI
  }
};