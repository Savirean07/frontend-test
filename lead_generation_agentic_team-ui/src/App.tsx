import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalContext } from "./auth";

import { About } from "./pages";
import { PublicRoute, RouteWithNav } from "./routes";
import { useNotification } from "./hooks";
import "./font.css";
import "./App.css";
import { useMsalAuthority } from "./hooks/msal.hook";
import TestSocketIo from "./test/socket.io.test";

const Home = lazy(() => import("./pages/home"));
const Blog = lazy(() => import("./pages/blog"));
const Contact = lazy(() => import("./pages/contact"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Subscription = lazy(() => import("./pages/subscription-plan"));
const Roles = lazy(() => import("./pages/roles"));
const WorkingPage = lazy(() => import("./pages/page-not-found"));
const RoleLeadGenerator = lazy(() => import("./pages/role-Lead-generator"));
const RoleLinkedInProfileScraper = lazy(
  () => import("./pages/role-profile-analyst")
);
const EmailGeneratorRole = lazy(() => import("./pages/role-email-generator"));

interface AppProps {
  msalInstance: PublicClientApplication | null;
}

function App({ msalInstance }: AppProps) {
  const { pushNotification } = useNotification();
  const { setAuthority, authority } = useMsalAuthority();
  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine;
  });

  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOffline(false);
    });
    window.addEventListener("offline", () => {
      setIsOffline(true);
    });
  }, []);
  return (
    <>
      <MsalContext.Provider
        value={{
          msalInstance,
          pushNotification: pushNotification as () => void,
          authority: authority,
          setAuthority: setAuthority,
        }}
      >
        <div className="min-h-screen bg-black text-white relative">
          <div className="flex justify-center">
            <p
              hidden={!isOffline}
              className="bg-red-500/10 rounded-md text-red-500 px-4 text-center top-0 backdrop-blur-xl w-full"
            >
              No Internet
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen bg-black text-white">
                <img
                  src="/image/Wintellisys_Logo 1.png"
                  alt="Wintellisys"
                  className="animate-bounce max-w-[300px]"
                />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<RouteWithNav />}>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog/:blogId" element={<Blog />} />
                  <Route path="/blog" element={<Navigate to={"/blog/1"} />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/*" element={<WorkingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/subscription-plan" element={<Subscription />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/test-socket-io" element={<TestSocketIo />} />
                </Route>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/roles/lead-generator"
                element={<RoleLeadGenerator />}
              />
              <Route
                path="/roles/profile-analyst"
                element={<RoleLinkedInProfileScraper />}
              />
              <Route
                path="/roles/mail-composer"
                element={<EmailGeneratorRole />}
              />
            </Routes>
          </Suspense>
        </div>
      </MsalContext.Provider>
    </>
  );
}

export default App;
