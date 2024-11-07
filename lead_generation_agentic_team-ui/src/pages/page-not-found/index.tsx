import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Go back to home</Link>
    </div>
  );
}

export const WorkingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Coming Soon...</h1>
      <p className="text-lg text-gray-600">
        {/* We are working on "{window.location.pathname}" route. */}
      </p>
    </div>
  );
};
